call plug#begin('~/.local/share/nvim/plugged')
Plug 'airblade/vim-gitgutter'                       " Adds gutter showing git diffs
Plug 'chriskempson/base16-vim'                      " Base 16 colorschemes
Plug 'editorconfig/editorconfig-vim'                " Editorconfig integration
Plug 'godlygeek/tabular'                            " Alignment plugin
Plug 'jiangmiao/auto-pairs'                         " Automatically add matching pairs
Plug 'jparise/vim-graphql'                          " Adds graphql support
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } } " Fuzzy searching
Plug 'junegunn/fzf.vim'
Plug 'junegunn/vim-easy-align'                      " Easly align symbols
Plug 'lervag/vimtex'                                " Latex support
Plug 'liuchengxu/vista.vim'                         " Adds an outline to code
Plug 'mattn/emmet-vim'                              " Adds emmet functionality
Plug 'morhetz/gruvbox'                              " Gruvbox theme and goodies
Plug 'neoclide/coc.nvim', {'branch': 'release'}     " Conquer of completion (intellisense)
Plug 'pantharshit00/vim-prisma'
Plug 'sheerun/vim-polyglot'                         " Extra syntax support
Plug 'tpope/vim-commentary'                         " Adds commentary mnemonic
Plug 'tpope/vim-fugitive'                           " Git integration
Plug 'tpope/vim-sensible'                           " Sensible default settings that every vim user should have
Plug 'tpope/vim-surround'                           " Adds surround mnemonic
Plug 'vim-airline/vim-airline'                      " Airline
Plug 'vim-scripts/gnuplot.vim'                      " Gnuplot syntax highlighting
call plug#end()

let base16colorspace=256                   " Sets the color mode to 256 colors for base16 color schemes
let g:airline_theme='gruvbox'              " Set airline theme
let g:airline_powerline_fonts=1            " Enable powerline fonts
let g:airline#extensions#tabline#enabled=1 " Show all buffers when there is only one tab open
let g:gruvbox_contrast_dark='hard'         " Sets contrast mode for gruvbox for dark setting
let g:gruvbox_contrast_light='hard'        " Sets contrast mode for gruvbox for dark setting
let g:gruvbox_invert_selection=0           " Do not invert selection
let g:gruvbox_sign_column='bg0'            " Gruvbox sign column background color
let g:fzf_preview_window='right:50%'       " FZF preview disable
let g:tex_flavor='latex'                   " Sets the tex file extension to interpret LaTeX files
let g:vimtex_view_general_viewer='skim'
let g:vimtex_view_method='skim'

set autoindent                " Enables auto indentation
set background=dark           " Sets the background mode
" set colorcolumn=+1,+2,+41,+42 " Set guidelines
" set cursorline                " Highlights current line
set expandtab                 " Use spaces as tabs
set incsearch                 " Enables incremental search
set lazyredraw                " More optimal rendering
set mouse=a                   " Enables the mouse with scrolling
set noshowmode                " Disables mode output text since Airline does this anyway
set noswapfile                " Disables swap files
set number                    " Enables line numbers
set relativenumber            " Enables relative numbering
set shiftwidth=4              " Sets the tab (shift) width to 4
set smartcase                 " Enables smart case search
set smartindent               " Enables smart indentation
set splitbelow                " Opens horisontal split at the bottom
set splitright                " Opens vertical split to the right
set tabstop=4                 " Set the tab (tab) width to 4
set termguicolors             " Enables 24-bit RGB color
" set textwidth=80              " Line wrapping
set undofile                  " Save undos after file closes
set undodir=$HOME/.vim/undo   " where to save undo histories
set undolevels=1000           " How many undos
set undoreload=10000          " number of lines to save for undo

" Sets the color scheme
colorscheme gruvbox

" Enables filetype checking
filetype on

" Enables syntax highlighting
syntax on

" FZF Mappings
nnoremap <C-p> :GFiles<cr>
nnoremap <leader>p :Files<cr>
nnoremap <C-f> :CocSearch

" Keeps search under cursor on current word
nnoremap * *``

" Start interactive EasyAlign in visual mode (e.g. vipga)
xmap ga <Plug>(EasyAlign)

" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)

" Easy Align custom delimiters
let g:easy_align_delimiters = {
            \ '%': { 'pattern': '%\+', 'delimiter_align': 'l', 'ignore_groups': ['!Comment'] }
            \ }


""""""""""
" COC - Sort this later
"""""""""

" TextEdit might fail if hidden is not set.
set hidden

" Some servers have issues with backup files, see #649.
set nobackup
set nowritebackup

" Give more space for displaying messages.
set cmdheight=2

" Having longer updatetime (default is 4000 ms i= 4 s) leads to noticeable
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
" <cr> could be remapped by other vim plugin, try `:verbose imap <CR>`.
if exists('*complete_info')
    inoremap <expr> <cr> complete_info()["selected"] != "-1" ? "\<C-y>" : "\<C-g>u\<CR>"
else
    inoremap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"
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
nnoremap <silent> <space>p  :<C-u>CocListResume<CR>






"""
" COC explorer
"""
nmap <space>e :CocCommand explorer<CR>


"""
" COC Multiple cursors
"""
" Make the selection a diffent color than for seach highlight
hi CocCursorRange guibg=#b16286 guifg=#ebdbb2

" Selection key mapping
nmap <expr> <silent> <C-s> <SID>select_current_word()
function! s:select_current_word()
    if !get(g:, 'coc_cursors_activated', 0)
        return "\<Plug>(coc-cursors-word)*"
    endif
    return "*n\<Plug>(coc-cursors-word)*"
endfunc

" Refactor
nmap <silent> <leader>r <Plug>(coc-refactor)*


"""
" Jump to last edit in file
"""
if has("autocmd")
    au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif



" Makes the ~ characters at end of file same as background
hi NonText guifg=bg
