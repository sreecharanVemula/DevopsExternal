terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "student_crud" {
  name = "studnet-crud-app:1.0"
}

resource "docker_container" "student_crud" {
  name  = "student-crud"
  image = docker_image.student_crud.name

  ports {
    internal = 3000
    external = 3000
  }
}
