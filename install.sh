#!/usr/bin/env sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Relative path to dotfiles.
ROOT=$(git rev-parse --show-toplevel)


################################################################################
# GIT-COMPLETION
################################################################################

GIT_COMPLETION_BASH_URL=https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
GIT_COMPLETION_BASH_PATH=git/git-completion.bash.symlink

# Get latest git-completion script.
echo "Getting latest git-completion.bash."
curl -fsSL ${GIT_COMPLETION_BASH_URL} > ${GIT_COMPLETION_BASH_PATH}


################################################################################
# SYMLINKS
################################################################################

echo "Installing symlinks."
SYMLINKS=$(find . -not -path "*/\.git*" -name "*.symlink")

for SYMLINK in ${SYMLINKS}
do
    # Get basename from symlink.
    SYMLINK_FILE=$(basename ${SYMLINK})

    # Formulating .dotfile notation.
    DOTFILE=.$(echo ${SYMLINK_FILE} | sed -e "s/.symlink//g")

    # First remove .dotfiles.
    echo " - Removing ~/${DOTFILE}"
    rm -rf ~/${DOTFILE}

    # Then re-link them.
    echo " - Linking ${SYMLINK} to ~/${DOTFILE}"
    ln -fs "${ROOT}/${SYMLINK}" ~/${DOTFILE}
done


################################################################################
# FLEXGET
################################################################################

echo "Installing flexget config."
echo " - Installing binary."
#easy_install pip
pip install --user setuptools
pip install --user flexget

################################################################################
# SUBMODULES
################################################################################

echo "Initialising submodules."
git submodule init
git submodule update

echo "Updating and checking out submodules."
git submodule foreach git checkout master
git submodule foreach git pull origin master


################################################################################
# VIM
################################################################################

# Autoload.
echo "Getting latest autoload script."

AUTOLOAD_URL=https://raw.githubusercontent.com/tpope/vim-pathogen/master/autoload/pathogen.vim
AUTOLOAD_PATH=vim/vim.symlink/autoload/pathogen.vim

mkdir -p vim/vim.symlink/autoload
curl -fsSL ${AUTOLOAD_URL} > ${AUTOLOAD_PATH}

# Preparing temporary directories.
echo "Preparing vim temporary directories."

echo " - Recreating ~/.tmp"
rm -rf ~/.tmp
mkdir -p ~/.tmp

echo " - Recreating ~/.tmp/bak"
rm -rf ~/.tmp/bak
mkdir -p ~/.tmp/bak

echo " - Recreating ~/.tmp/swp"
rm -rf ~/.tmp/swap
mkdir -p ~/.tmp/swap

echo " - Recreating ~/.tmp/undo"
rm -rf ~/.tmp/undo
mkdir -p ~/.tmp/undo


################################################################################
# ZSH
################################################################################

echo "Setting default shell to zsh."
chsh -s /bin/zsh
