#Load the ssh key from the variables
mkdir ~/.ssh; echo "$GITLAB_SSH_PRIVATE_KEY" | perl -lpe 's/\s+$//' > ~/.ssh/id_rsa
#change the permissions so ssh accepts the key
echo "Dingus"
echo "$GITLAB_SSH_PRIVATE_KEY"
cat ~/.ssh/id_rsa
chmod 0600 ~/.ssh/id_rsa
#add aptible to known hosts
ssh-keyscan beta.aptible.com | tee -a ~/.ssh/known_hosts
