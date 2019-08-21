resource "aws_instance" "single_node" {

  # us-east-1 bionic 18.04 LTS amd64 hvm:ebs-ssd 20180912
  # https://cloud-images.ubuntu.com/locator/ec2/
  ami = "ami-0ac019f4fcb7cb7e6"
  instance_type = "t2.small"
  subnet_id = "${var.subnet_id}"
  vpc_security_group_ids = ["${aws_security_group.single_node.id}"]
  associate_public_ip_address = true
  key_name = "${aws_key_pair.single_node.key_name}"
  credit_specification {
    cpu_credits = "unlimited"
  }

  root_block_device {
    volume_type = "standard"
    volume_size = 20
  }

  tags {
    Name = "single-node--${var.env}"
  }
}

output "single_node_ip" {
  value = "${aws_instance.single_node.public_ip}"
}

output "single_node_key_name" {
  value = "${aws_instance.single_node.key_name}"
}

resource "aws_security_group" "single_node" {
  name = "${var.env}-single_node_ssh_http"
  lifecycle {
    create_before_destroy = true
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  vpc_id = "${var.vpc_id}"

  tags {
    Name = "single-node--${var.env}--security-group"
  }
}

resource "aws_key_pair" "single_node" {
  key_name   = "single-node--${var.env}"
  public_key = "${data.local_file.public_key.content}"
}

data "local_file" "public_key" {
  filename = "single-node--${var.env}.key.pub"
}

data "aws_route53_zone" "main" {
  name         = "libero.pub."
}

resource "aws_route53_record" "facade" {
  zone_id = "${data.aws_route53_zone.main.zone_id}"
  name    = "${var.env}.${data.aws_route53_zone.main.name}"
  type    = "A"
  ttl     = "60"
  records = ["${aws_instance.single_node.public_ip}"]
}
