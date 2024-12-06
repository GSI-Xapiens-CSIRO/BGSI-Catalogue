import os
import hashlib
import sys
import subprocess
import json


ENVIRONMENT = """export const environment = {{
  production: {production},
  api_endpoint_hubs: [
    {{
        name: 'HUB 1',
        endpoint: '{api_endpoint_hub1}',
        region: '{region}',
    }},
  ]
}};"""


# docs - https://stackoverflow.com/questions/36204248/creating-unique-hash-for-directory-in-python
def sha1_of_file(filepath: str):
    sha = hashlib.sha1()
    sha.update(filepath.encode())

    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(2**10), b""):
            sha.update(block)
        return sha.hexdigest()


def hash_dir(dir_path: str):
    sha = hashlib.sha1()

    for path, _, files in os.walk(dir_path):
        # we sort to guarantee that files will always go in the same order
        for file in sorted(files):
            file_hash = sha1_of_file(os.path.join(path, file))
            sha.update(file_hash.encode())

    return sha.hexdigest()


def npm_install(cmd: str, dir: str):
    out = subprocess.Popen(
        cmd.split(),
        cwd=dir,
        encoding="ascii",
        stdout=sys.stderr,
    )
    code = out.wait()
    assert code == 0, "ERROR: npm install returned non-zero exit"


def build(cmd: str, dir: str):
    out = subprocess.Popen(
        cmd.split(),
        cwd=dir,
        stdout=sys.stderr,
    )
    code = out.wait()
    assert code == 0, "ERROR: ng build returned non-zero exit"

def setup_env(
    dir: str,
    region: str,
    api_endpoint_hub1: str,
):
    with open(
        os.path.join(dir, "src/environments/environment.development.ts"), "w"
    ) as f:
        f.write(
            ENVIRONMENT.format(
                production="false",
                region=region,
                api_endpoint_hub1=api_endpoint_hub1,
            )
        )
    with open(os.path.join(dir, "src/environments/environment.ts"), "w") as f:
        f.write(
            ENVIRONMENT.format(
                production="true",
                region=region,
                api_endpoint_hub1=api_endpoint_hub1,
            )
        )


if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    build_cmd = args["build_command"]
    install_cmd = args["install_command"]
    webapp_dir = args["webapp_dir"]
    build_destination = args["build_destination"]
    region = args["region"]
    api_endpoint_hub1 = args["api_endpoint_hub1"]

    setup_env(
        webapp_dir,
        region,
        api_endpoint_hub1
    )
    npm_install(install_cmd, webapp_dir)
    build(build_cmd, webapp_dir)
    print(f""" {{ "hash": "{hash_dir(build_destination)}" }} """)
