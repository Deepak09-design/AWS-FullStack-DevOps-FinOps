output "alb_dns_name" { value = aws_lb.main.dns_name }
output "ec2_instance_id" { value = aws_instance.application.id }
output "application_security_group_id" { value = aws_security_group.application.id }
