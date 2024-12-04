resource "aws_cloudfront_origin_access_control" "bgsi-catalogue-s3-distribution" {
  name                              = "bgsi-catalogue-access-control"
  description                       = "Policy for BGSI Catalogue UI"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "bgsi-catalogue-s3-distribution-cache-policy" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "bgsi-catalogue-s3-distribution" {
  origin {
    domain_name              = aws_s3_bucket.bgsi-catalogue-hosted-bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.bgsi-catalogue-s3-distribution.id
    origin_id                = "bgsi-catalogue-s3-origin-id"
  }

  comment             = "Distribution for BGSI Catalogue UI"
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  default_root_object = "index.html"

  custom_error_response {
    response_code      = 200
    error_code         = 404
    response_page_path = "/index.html"
  }

  custom_error_response {
    response_code      = 200
    error_code         = 403
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "bgsi-catalogue-s3-origin-id"
    cache_policy_id        = data.aws_cloudfront_cache_policy.bgsi-catalogue-s3-distribution-cache-policy.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.common-tags
}