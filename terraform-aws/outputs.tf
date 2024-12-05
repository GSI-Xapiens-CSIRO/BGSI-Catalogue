output "cloudfront-url" {
  value       = "https://${aws_cloudfront_distribution.bgsi-catalogue-s3-distribution.domain_name}"
  description = "Cloud front URL"
}