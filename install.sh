#!/usr/bin/env bash

set -e

if [[ "$(uname)" == "Darwin" ]]; then
  if [[ -z "$(xcode-select -p)" ]]; then
    xcode-select --install
  fi

  brew bundle --file brew/Brewfile
fi

if [[ ! -d ~/.oh-my-zsh ]]; then
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
	rm -rf ~/.oh-my-zsh
fi

if [[ $SHELL != *"zsh"* ]]; then
  echo "zsh"
  chsh -s /bin/zsh
fi

mkdir -p ~/.config/nvim
mkdir -p ~/.vim

ln -sf $(pwd)/fzf/.fzf.zsh ~/.fzf.zsh
ln -sf $(pwd)/git/.gitignore ~/.gitignore
ln -sf $(pwd)/git/.gitconfig ~/.gitconfig
ln -sf $(pwd)/base16/shell ~/.config/base16-shell
ln -sf $(pwd)/nvim/init.vim ~/.vimrc
ln -sf $(pwd)/nvim/init.vim ~/.config/nvim/init.vim
ln -sf $(pwd)/nvim/coc/coc-settings.json ~/.config/nvim
ln -sf $(pwd)/tmux/.tmux/ ~/
ln -sf $(pwd)/tmux/.tmux.conf ~/.tmux.conf
ln -sf $(pwd)/zsh/.hushlogin ~/.hushlogin
ln -sf $(pwd)/zsh/.oh-my-zsh/custom ~/.oh-my-zsh
ln -sf $(pwd)/zsh/.zshrc ~/.zshrc
ln -sf $(pwd)/zsh/.p10k.zsh ~/.p10k.zsh

curl \
	-sfLo \
	~/.local/share/nvim/site/autoload/plug.vim \
	--create-dirs \
    	https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

nvim +PlugInstall +qall

