# andasy.hcl app configuration file generated for jobportal on Wednesday, 15-Apr-26 10:58:05 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "jobportal"

app {

  env = {}

  port = 5000

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "jobportal"
  }

}
