# Settings
COMPLETION_WAITING_DOTS="true"
HIST_STAMPS="yyyy-mm-dd"
ZSH_CUSTOM="$HOME/.oh-my-zsh-custom"
ZSH_THEME="agnoster-custom"

# Exports
export EDITOR="nvim"
export LANG="en_US.UTF-8"
export LC_ALL=""
export LC_CTYPE="en_US.UTF-8"
export MANPATH="/usr/local/man:$MANPATH"
export PATH="$HOME/bin:/usr/local/bin:$PATH"
export UPDATE_ZSH_DAYS="13"
export ZSH="$HOME/.oh-my-zsh"

# Aliases
eval $(thefuck --alias)
alias tmux="TERM=xterm-256color tmux"
alias vim="nvim"

# Keybindings
bindkey "^[^[[C" forward-word
bindkey "^[^[[D" backward-word

# Plugins
plugins=(
  brew
  colored-man-pages
  cp
  docker-compose
  docker
  gcloud
  git
	history
  history-substring-search
  kubectl
  ng
  nmap
  node
  npm
  nvm
  pip
  python
  rsync
  terraform
  thefuck
  tig
  tmux
  virtualenv
  vi-mode
  yarn
	zsh-autosuggestions
)

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

# Disable user@hostname prompt
#prompt_context() {
  #if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    #prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
  #fi
#}

# oh-my-zsh
source $ZSH/oh-my-zsh.sh


