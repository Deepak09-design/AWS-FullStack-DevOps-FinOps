resource "aws_cloudwatch_metric_alarm" "ec2_cpu_high" {
  count               = var.create_cpu_alarm ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-ec2-high-cpu"
  alarm_description   = "CloudCart EC2 average CPU utilization is above 80 percent."
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  treat_missing_data  = "notBreaching"

  dimensions = {
    InstanceId = var.ec2_instance_id
  }

  tags = var.tags
}

resource "aws_budgets_budget" "monthly" {
  count        = var.budget_limit_usd != null && var.budget_email != "" ? 1 : 0
  name         = "${var.project_name}-${var.environment}-monthly-cost-budget"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_limit_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                   = 80
    threshold_type              = "PERCENTAGE"
    notification_type           = "ACTUAL"
    subscriber_email_addresses  = [var.budget_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                   = 100
    threshold_type              = "PERCENTAGE"
    notification_type           = "FORECASTED"
    subscriber_email_addresses  = [var.budget_email]
  }
}
