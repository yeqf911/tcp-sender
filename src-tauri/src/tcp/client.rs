use anyhow::{Context, Result};
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt, Interest};
use tokio::net::TcpStream;
use tokio::time::timeout;

#[derive(Debug, Clone)]
pub struct TcpClientConfig {
    pub host: String,
    pub port: u16,
    pub timeout_secs: u64,
    pub keep_alive: bool,
}

pub struct TcpClient {
    stream: Option<TcpStream>,
    config: TcpClientConfig,
}

impl TcpClient {
    pub fn new(config: TcpClientConfig) -> Self {
        Self {
            stream: None,
            config,
        }
    }

    pub async fn connect(&mut self) -> Result<()> {
        let addr = format!("{}:{}", self.config.host, self.config.port);

        let stream = timeout(
            Duration::from_secs(self.config.timeout_secs),
            TcpStream::connect(&addr),
        )
        .await
        .context("Connection timeout")?
        .context(format!("Failed to connect to {}", addr))?;

        if self.config.keep_alive {
            let socket = socket2::Socket::from(stream.into_std()?);
            socket.set_keepalive(true)?;
            self.stream = Some(TcpStream::from_std(socket.into())?);
        } else {
            self.stream = Some(stream);
        }

        Ok(())
    }

    pub async fn send(&mut self, data: &[u8]) -> Result<()> {
        let stream = self
            .stream
            .as_mut()
            .context("Not connected. Call connect() first")?;

        timeout(
            Duration::from_secs(self.config.timeout_secs),
            stream.write_all(data),
        )
        .await
        .context("Send timeout")?
        .context("Failed to send data")?;

        stream.flush().await.context("Failed to flush stream")?;

        Ok(())
    }

    pub async fn receive(&mut self, buffer_size: usize) -> Result<Vec<u8>> {
        let stream = self
            .stream
            .as_mut()
            .context("Not connected. Call connect() first")?;

        let mut buffer = vec![0u8; buffer_size];

        let n = timeout(
            Duration::from_secs(self.config.timeout_secs),
            stream.read(&mut buffer),
        )
        .await
        .context("Receive timeout")?
        .context("Failed to read data")?;

        buffer.truncate(n);
        Ok(buffer)
    }

    pub async fn send_and_receive(&mut self, data: &[u8], buffer_size: usize) -> Result<Vec<u8>> {
        self.send(data).await?;
        self.receive(buffer_size).await
    }

    pub async fn disconnect(&mut self) -> Result<()> {
        if let Some(mut stream) = self.stream.take() {
            stream.shutdown().await.context("Failed to shutdown connection")?;
        }
        Ok(())
    }

    pub fn is_connected(&self) -> bool {
        self.stream.is_some()
    }

    /// Check if the TCP connection is still alive by testing the socket state.
    /// Returns true if the connection is active, false if disconnected.
    pub async fn check_connection(&mut self) -> bool {
        let stream = match self.stream.as_mut() {
            Some(s) => s,
            None => return false,
        };

        // Try to poll the read readiness with a very short timeout
        // This will detect if the connection has been closed by the peer
        match timeout(Duration::from_millis(100), stream.ready(Interest::READABLE)).await {
            Ok(Ok(_)) => {
                // Stream is readable or has been closed
                // Try a non-blocking read to check if EOF (connection closed)
                let mut buf = [0u8; 1];
                match stream.try_read(&mut buf) {
                    Ok(0) => {
                        // EOF - connection closed by peer
                        self.stream = None;
                        false
                    }
                    Ok(_) => {
                        // Data available - connection is alive
                        true
                    }
                    Err(e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                        // No data available but connection is still alive
                        true
                    }
                    Err(_) => {
                        // Connection error
                        self.stream = None;
                        false
                    }
                }
            }
            Ok(Err(_)) => {
                // Error polling readiness
                self.stream = None;
                false
            }
            Err(_) => {
                // Timeout - assume connection is still alive
                // (couldn't determine status within timeout)
                true
            }
        }
    }
}
