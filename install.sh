#!/usr/bin/env bash

set -ex

if [[ "$(uname)" == "Darwin" ]]; then
  if [[ -z "$(xcode-select -p)" ]]; then
    xcode-select --install
  fi

  brew bundle --file brew/Brewfile
fi

if [[ $SHELL != *"zsh"* ]]; then
  echo "zsh"
  chsh -s /bin/zsh
fi

ln -sf $(pwd)/git/.gitignore ~/.gitignore
ln -sf $(pwd)/git/.gitconfig ~/.gitconfig

mkdir -p ~/.vim
mkdir -p ~/.config/nvim
ln -sf $(pwd)/nvim/init.vim ~/.vimrc
ln -sf $(pwd)/nvim/init.vim ~/.config/nvim/init.vim
ln -sf $(pwd)/tmux/.tmux.conf ~/.tmux.conf
ln -sf $(pwd)/zsh/.hushlogin ~/.hushlogin
ln -sf $(pwd)/zsh/.zshrc ~/.zshrc

if [[ ! -d ~/.oh-my-zsh ]]; then
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
fi

curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

nvim +PlugInstall +qall
