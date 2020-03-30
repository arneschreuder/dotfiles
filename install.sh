#!/usr/bin/env sh

# Exit if error occurs 
set -e

# Run brew bundle if on mac
if [[ "$(uname)" == "Darwin" ]]; then
  # XCode
  if [[ -z "$(xcode-select -p)" ]]; then
    xcode-select --install
  fi

  # Brewfile
  brew bundle --file brew/Brewfile
fi
# Change the default shell to zsh
if [[ $SHELL != *"zsh"* ]]; then
  echo "zsh"
  # chsh -s /bin/zsh
fi

# Symlink dotfiles
# Git
ln -sf $(pwd)/git/.gitignore ~/.gitignore
ln -sf $(pwd)/git/.gitconfig ~/.gitconfig

# Vim and Neovim
mkdir -p ~/.vim
mkdir -p ~/.config/nvim
ln -sf $(pwd)/nvim/init.vim ~/.vimrc
ln -sf $(pwd)/nvim/init.vim ~/.config/nvim/init.vim

#TMUX
ln -sf $(pwd)/tmux/.tmux.conf ~/.tmux.conf

# ZSH
ln -sf $(pwd)/zsh/.hushlogin ~/.hushlogin
ln -sf $(pwd)/zsh/.oh-my-zsh-custom ~/.oh-my-zsh-custom
ln -sf $(pwd)/zsh/.zshrc ~/.zshrc

# Install oh-my-zsh
if [[ ! -d ~/.oh-my-zsh ]]; then
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
fi

# Install vim.plug
curl \
  -sfLo \
  ~/.local/share/nvim/site/autoload/plug.vim \
  --create-dirs \
	https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

# Install nvim plugins
nvim +PlugInstall +qall

# Install all COC extensions
nvim +CocInstall +qall coc-actions # Actions menu for Neovim
nvim +CocInstall +qall coc-angular # for angular
nvim +CocInstall +qall coc-bookmark # bookmark extension
nvim +CocInstall +qall coc-calc # expression calculation extension
nvim +CocInstall +qall coc-clangd # for C/C++/Objective-C, use clangd
nvim +CocInstall +qall coc-cmake # for cmake code completion
nvim +CocInstall +qall coc-css # for css, scss and less
nvim +CocInstall +qall coc-emmet # provides emmet suggestions in completion list
nvim +CocInstall +qall coc-explorer # file explorer extension
nvim +CocInstall +qall coc-flutter # for flutter
nvim +CocInstall +qall coc-git  # provides git integration
nvim +CocInstall +qall coc-highlight # provides default document symbol highlighting and color support
nvim +CocInstall +qall coc-html # for html, handlebars and razor
nvim +CocInstall +qall coc-java # for java, use eclipsejdtls
nvim +CocInstall +qall coc-json # for json
nvim +CocInstall +qall coc-lists # provides some basic lists like fzfvim
nvim +CocInstall +qall coc-markdownlint  # for markdown linting
nvim +CocInstall +qall coc-metals # for Scala using Metals
nvim +CocInstall +qall coc-phpls # for php, use intelephense-docs
nvim +CocInstall +qall coc-python # for python, extension forked from vscode-python
nvim +CocInstall +qall coc-r-lsp # for r, use R languageserver
nvim +CocInstall +qall coc-rls # for rust, use Rust Language Server
nvim +CocInstall +qall coc-rust-analyzer # for rust, use rust-analyzer
nvim +CocInstall +qall coc-snippets # provides snippets solution
nvim +CocInstall +qall coc-sourcekit # for Swift
nvim +CocInstall +qall coc-spell-checker # A basic spell checker that works well with camelCase code
nvim +CocInstall +qall coc-sql # for SQL
nvim +CocInstall +qall coc-tabnine # for tabnine
nvim +CocInstall +qall coc-tasks # for asynctasksvim integration
nvim +CocInstall +qall coc-template # templates extension for file types
nvim +CocInstall +qall coc-texlab # for LaTex using TexLab
nvim +CocInstall +qall coc-todolist # for handy todolist/task management
nvim +CocInstall +qall coc-tsserver # for javascript and typescript
nvim +CocInstall +qall coc-vimtex # for latex
nvim +CocInstall +qall coc-xml # for xml, use lsp4xml
nvim +CocInstall +qall coc-yaml # for yaml
nvim +CocInstall +qall coc-yank # provides yank highlights & history

# Mac Specific
if [ "$(uname)" == "Darwin" ]; then
  # Python 2
  sudo easy_install pip
fi

# Install python providers for neovim
python -m pip install pynvim
pip install python-language-server
pip install pylint 

# Python 3
python3 -m pip install pynvim
python3 -m pip install python-language-server
python3 -m pip install pylint


# Install ruby providers for neovim
sudo gem install neovim

# Install nodejs providers for neovim
# Use yarn if installed
if [[ $(which yarn) == *"yarn"* ]]; then
  yarn global add neovim
else
  npm install -g neovim
fi

# Done
echo "Done!"
