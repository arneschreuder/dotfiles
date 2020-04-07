"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"PLUGINS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
call plug#begin('~/.local/share/nvim/plugged')
  Plug 'airblade/vim-gitgutter' " Adds git gutter
  Plug 'altercation/vim-colors-solarized' " Solarized color scolor scheme
  Plug 'ctrlpvim/ctrlp.vim' " Fuzzy file buffer
  Plug 'edkolev/tmuxline.vim' " Adds tmux airline
  Plug 'easymotion/vim-easymotion' " Enables easy motion
  Plug 'godlygeek/tabular' " Smart tab aligning
  Plug 'jiangmiao/auto-pairs' " Automatically add pairs of brackets, parents, quotes
  Plug 'jmcantrell/vim-virtualenv' " Support for virtualenv
  Plug 'lervag/vimtex' " Latex support
  Plug 'majutsushi/tagbar' " Adds tagbar/outline of current file
  Plug 'morhetz/gruvbox' " Gruvbox color scheme
  Plug 'neoclide/coc.nvim', {'branch': 'release'} " Intellisense
  Plug 'preservim/nerdtree', { 'on':  'NERDTreeToggle' } " Tree explorer
  Plug 'preservim/nerdcommenter' " Commenting
  Plug 'prettier/vim-prettier', { 'do': 'yarn install' } " Formatting (on save)
  Plug 'ryanoasis/vim-devicons'
  Plug 'sonph/onehalf' " One half color scheme
  Plug 'scalameta/metals' " Scala language server
  Plug 'terryma/vim-multiple-cursors' " Support multiple cursors
  Plug 'tiagofumo/vim-nerdtree-syntax-highlight' " Colored icons
  Plug 'tomasr/molokai' " Molokai color scheme
  Plug 'tpope/vim-fugitive' " Git integration
  Plug 'tpope/vim-surround' " Edit surrounding characters
  Plug 'tsony-tsonev/nerdtree-git-plugin' " Colorised nerdtree git status
  Plug 'vim-airline/vim-airline' " Powerline-like statusbar
  Plug 'vim-airline/vim-airline-themes' " Airline themes
  Plug 'vim-scripts/Wombat' " Wombat color scheme
  Plug 'w0rp/ale' " Linting
call plug#end()


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" AIRLINE
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

let g:airline_powerline_fonts=1 " Enabled patched fonts
let g:airline_theme='molokai' " Sets the theme
let g:airline#extensions#tabline#enabled=1 " Automatic display all buffers when there is only one tab open


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" ALE
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

let g:airline#extensions#ale#enabled=1


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" CTRLP
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

let g:ctrlp_custom_ignore = 'node_modules\|DS_Store\|git'
let g:ctrlp_max_files=0
let g:ctrlp_show_hidden = 1


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" GIT GUTTER
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

let g:gitgutter_terminal_reports_focus=0


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" GRUVBOX
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

"let g:gruvbox_bold=1
"let g:gruvbox_italic=1
"let g:gruvbox_contrast_dark='hard'

"nnoremap <silent> [oh :call gruvbox#hls_show()<CR>
"nnoremap <silent> ]oh :call gruvbox#hls_hide()<CR>
"nnoremap <silent> coh :call gruvbox#hls_toggle()<CR>

"nnoremap * :let @/ = ""<CR>:call gruvbox#hls_show()<CR>*
"nnoremap / :let @/ = ""<CR>:call gruvbox#hls_show()<CR>/
"nnoremap ? :let @/ = ""<CR>:call gruvbox#hls_show()<CR>?


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" COC
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" TextEdit might fail if hidden is not set.
set hidden

" Some servers have issues with backup files, see #649.
set nobackup
set nowritebackup

" Give more space for displaying messages.
set cmdheight=1

" Having longer updatetime (default is 4000 ms = 4 s) leads to noticeable
" delays and poor user experience.
set updatetime=300

" Don't pass messages to |ins-completion-menu|.
set shortmess+=c

" Always show the signcolumn, otherwise it would shift the text each time
" diagnostics appear/become resolved.
set signcolumn=yes

" Use tab for trigger completion with characters ahead and navigate.
" NOTE: Use command ':verbose imap <tab>' to make sure tab is not mapped by
" other plugin before putting this into your config.
inoremap <silent><expr> <TAB>
      \ pumvisible() ? "\<C-n>" :
      \ <SID>check_back_space() ? "\<TAB>" :
      \ coc#refresh()
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

function! s:check_back_space() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" Use <c-space> to trigger completion.
inoremap <silent><expr> <c-space> coc#refresh()

" Use <cr> to confirm completion, `<C-g>u` means break undo chain at current
" position. Coc only does snippet and additional edit on confirm.
if has('patch8.1.1068')
  " Use `complete_info` if your (Neo)Vim version supports it.
  inoremap <expr> <cr> complete_info()["selected"] != "-1" ? "\<C-y>" : "\<C-g>u\<CR>"
else
  imap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"
endif

" Use `[g` and `]g` to navigate diagnostics
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" GoTo code navigation.
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

" Use K to show documentation in preview window.
nnoremap <silent> K :call <SID>show_documentation()<CR>

function! s:show_documentation()
  if (index(['vim','help'], &filetype) >= 0)
    execute 'h '.expand('<cword>')
  else
    call CocAction('doHover')
  endif
endfunction

" Highlight the symbol and its references when holding the cursor.
autocmd CursorHold * silent call CocActionAsync('highlight')

" Symbol renaming.
nmap <leader>rn <Plug>(coc-rename)

" Formatting selected code.
xmap <leader>f  <Plug>(coc-format-selected)
nmap <leader>f  <Plug>(coc-format-selected)

augroup mygroup
  autocmd!
  " Setup formatexpr specified filetype(s).
  autocmd FileType typescript,json setl formatexpr=CocAction('formatSelected')
  " Update signature help on jump placeholder.
  autocmd User CocJumpPlaceholder call CocActionAsync('showSignatureHelp')
augroup end

" Applying codeAction to the selected region.
" Example: `<leader>aap` for current paragraph
xmap <leader>a  <Plug>(coc-codeaction-selected)
nmap <leader>a  <Plug>(coc-codeaction-selected)

" Remap keys for applying codeAction to the current line.
nmap <leader>ac  <Plug>(coc-codeaction)
" Apply AutoFix to problem on the current line.
nmap <leader>qf  <Plug>(coc-fix-current)

" Introduce function text object
" NOTE: Requires 'textDocument.documentSymbol' support from the language server.
xmap if <Plug>(coc-funcobj-i)
xmap af <Plug>(coc-funcobj-a)
omap if <Plug>(coc-funcobj-i)
omap af <Plug>(coc-funcobj-a)

" Use <TAB> for selections ranges.
" NOTE: Requires 'textDocument/selectionRange' support from the language server.
" coc-tsserver, coc-python are the examples of servers that support it.
nmap <silent> <TAB> <Plug>(coc-range-select)
xmap <silent> <TAB> <Plug>(coc-range-select)

" Add `:Format` command to format current buffer.
command! -nargs=0 Format :call CocAction('format')

" Add `:Fold` command to fold current buffer.
command! -nargs=? Fold :call     CocAction('fold', <f-args>)

" Add `:OR` command for organize imports of the current buffer.
command! -nargs=0 OR   :call     CocAction('runCommand', 'editor.action.organizeImport')

" Add (Neo)Vim's native statusline support.
" NOTE: Please see `:h coc-status` for integrations with external plugins that
" provide custom statusline: lightline.vim, vim-airline.
set statusline^=%{coc#status()}%{get(b:,'coc_current_function','')}

" Mappings using CoCList:
" Show all diagnostics.
nnoremap <silent> <space>a  :<C-u>CocList diagnostics<cr>
" Manage extensions.
nnoremap <silent> <space>e  :<C-u>CocList extensions<cr>
" Show commands.
nnoremap <silent> <space>c  :<C-u>CocList commands<cr>
" Find symbol of current document.
nnoremap <silent> <space>o  :<C-u>CocList outline<cr>
" Search workspace symbols.
nnoremap <silent> <space>s  :<C-u>CocList -I symbols<cr>
" Do default action for next item.
nnoremap <silent> <space>j  :<C-u>CocNext<CR>
" Do default action for previous item.
nnoremap <silent> <space>k  :<C-u>CocPrev<CR>
" Resume latest coc list.


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" NERDTREE
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let NERDTreeShowHidden=1
" Toggle nerdtree
nmap <C-\> :NERDTreeToggle<CR>

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" NERDTREECOMMENTER
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
nmap <C-_> <Plug>NERDCommenterToggle
vmap <C-_> <Plug>NERDCommenterToggle<CR>gv


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" NERDTREE-GIT-STATUS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:NERDTreeShowIgnoredStatus = 1
let g:NERDTreeGitStatusWithFlags = 1
let g:NERDTreeIndicatorMapCustom = {
  \ "Modified"  : "✹",
  \ "Staged"    : "✚",
  \ "Untracked" : "✭",
  \ "Renamed"   : "➜",
  \ "Unmerged"  : "═",
  \ "Deleted"   : "✖",
  \ "Dirty"     : "✗",
  \ "Clean"     : "✔︎",
  \ 'Ignored'   : '☒',
  \ "Unknown"   : "?"
\ }
let g:NERDTreeGitStatusNodeColorization = 1
let g:NERDTreeColorMapCustom = {
  \ "Modified"  : "#528AB3",  
  \ "Staged"    : "#538B54",  
  \ "Untracked" : "#BE5849",  
  \ "Dirty"     : "#299999",  
  \ "Clean"     : "#87939A",   
  \ "Ignored"   : "#808080"   
\ }

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" TAGBAR
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" nmap <F8> :TagbarToggle<CR>

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" VIM-DEVICONS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:WebDevIconsUnicodeDecorateFolderNodes = 1
let g:DevIconsEnableFoldersOpenClose = 1

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" CONFIGURATIONS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
colorscheme molokai
filetype plugin on
syntax on " Enables syntax highlighting


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" SETTINGS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
set background=dark " Sets general theme
set cursorline " Highlightes the line the cursor is on
set encoding=UTF-8 " Sets the default encoding to UTF-8
set expandtab " Spaces for tab
set hidden " TextEdit might fail if hidden is not set.
set laststatus=2 " Always show the status line
set mouse=a " Enables the mouse in vim
set number " Enables normal line numbers
set relativenumber " Enables relative line numbers
set scrolloff=20 " Scroll so that at least 20 lines are show
set shell=zsh " Sets the default shell to sh
set shiftwidth=2 " Auto indent 2 spaces
set smarttab " Smart indentation
set softtabstop=0 " No tab characters
set t_Co=256 " Sets 256 colors
set tabstop=2 " Spaces for tabs
set termguicolors " True colors
set timeoutlen=500 " Timeout stops after 1s
set ttimeoutlen=5 " Timeout between keys

