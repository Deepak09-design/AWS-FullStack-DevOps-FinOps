variable "project_name" {
  description = "Project name used in resource names and tags."
  type        = string
  default     = "cloudcart"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "VPC IPv4 CIDR."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDRs for the two public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDRs for the two private database subnets."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the FastAPI host."
  type        = string
  default     = "t3.micro"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Initial MySQL database name."
  type        = string
  default     = "cloudcart"
}

variable "db_username" {
  description = "Master username for the development database."
  type        = string
  default     = "cloudcartadmin"
}

variable "db_allocated_storage" {
  description = "RDS storage in GiB."
  type        = number
  default     = 20
}

variable "enable_deletion_protection" {
  description = "Enable RDS deletion protection. Keep false for disposable dev."
  type        = bool
  default     = false
}

variable "enable_cloudwatch_alarm" {
  description = "Create an EC2 CPU alarm."
  type        = bool
  default     = true
}

variable "budget_limit_usd" {
  description = "Optional monthly AWS budget amount in USD. Set null to skip budget."
  type        = number
  default     = null
  nullable    = true
}

variable "budget_email" {
  description = "Email for budget alerts. Required when budget_limit_usd is set."
  type        = string
  default     = ""
}
