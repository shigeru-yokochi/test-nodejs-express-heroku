#!/bin/bash

set -eu
echo --- step1
git remote add heroku https://git.heroku.com/$HEROKU_APP_NAME.git
echo --- step2
cat > ~/.netrc << EOF
machine api.heroku.com
	login $HEROKU_LOGIN
	password $HEROKU_API_KEY
machine git.heroku.com
	login $HEROKU_LOGIN
	password $HEROKU_API_KEY
EOF
echo --- step3
# Add heroku.com to the list of known hosts
ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts
echo --- step4
mkdir ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = $AWS_ACCESS_KEY
aws_secret_access_key = $AWS_SECRET_KEY
EOF
echo --- step5