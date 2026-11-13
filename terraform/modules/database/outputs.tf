output "rds_endpoint" {
  value = "${aws_db_instance.main.address}:${aws_db_instance.main.port}"
}
output "database_secret_arn" {
  value = aws_secretsmanager_secret.database.arn
}
