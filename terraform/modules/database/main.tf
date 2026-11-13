resource "random_password" "master" {
  length           = 24
  special          = false
  upper            = true
  lower            = true
  numeric          = true
}

resource "aws_security_group" "database" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Allow MySQL only from the CloudCart application EC2 security group."
  vpc_id      = var.vpc_id

  ingress {
    description     = "MySQL from application host."
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [var.application_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "${var.project_name}-${var.environment}-rds-sg" })
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnets"
  subnet_ids = var.private_subnet_ids
  tags       = var.tags
}

resource "aws_db_instance" "main" {
  identifier                  = "${var.project_name}-${var.environment}-mysql"
  engine                      = "mysql"
  instance_class              = var.db_instance_class
  allocated_storage           = var.allocated_storage
  storage_type                = "gp3"
  storage_encrypted            = true
  db_name                     = var.db_name
  username                    = var.db_username
  password                    = random_password.master.result
  port                        = 3306
  db_subnet_group_name        = aws_db_subnet_group.main.name
  vpc_security_group_ids      = [aws_security_group.database.id]
  publicly_accessible         = false
  multi_az                    = false
  backup_retention_period     = 1
  auto_minor_version_upgrade  = true
  deletion_protection         = var.deletion_protection
  skip_final_snapshot         = true
  apply_immediately           = true

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-mysql"
  })
}

resource "aws_secretsmanager_secret" "database" {
  name                    = "${var.project_name}/${var.environment}/database"
  description             = "CloudCart RDS connection credentials."
  recovery_window_in_days = 7
  tags                    = var.tags
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id
  secret_string = jsonencode({
    engine   = "mysql"
    host     = aws_db_instance.main.address
    port     = 3306
    dbname   = var.db_name
    username = var.db_username
    password = random_password.master.result
  })
}
