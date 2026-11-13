project_name               = "cloudcart"
environment                = "dev"
aws_region                 = "us-east-1"
vpc_cidr                   = "10.0.0.0/16"
public_subnet_cidrs        = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs       = ["10.0.11.0/24", "10.0.12.0/24"]
ec2_instance_type          = "t3.micro"
db_instance_class          = "db.t3.micro"
db_name                    = "cloudcart"
db_username                = "cloudcartadmin"
db_allocated_storage       = 20
enable_deletion_protection = false
enable_cloudwatch_alarm    = true

# Optional: configure both values to create an AWS monthly cost budget.
# budget_limit_usd = 30
# budget_email     = "your-email@example.com"
