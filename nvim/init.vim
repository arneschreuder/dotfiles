call plug#begin('~/.local/share/nvim/plugged')
	" Gruvbox theme and goodies
	Plug 'morhetz/gruvbox'

	" Sensible default settings that every vim user should have
	Plug 'tpope/vim-sensible'

	" Airline
	Plug 'vim-airline/vim-airline'
call plug#end()

" Set airline theme
let g:airline_theme='gruvbox'

" Enable powerline fonts
let g:airline_powerline_fonts=1

" Show all buffers when there is only one tab open
let g:airline#extensions#tabline#enabled = 1

" Sets the color mode to 256 colors for base16 color schemes
let base16colorspace=256

" Sets contrast mode for gruvbox
let g:gruvbox_contrast_dark='hard'
let g:gruvbox_contrast_light='hard'

" Do not invert selection
let g:gruvbox_invert_selection=0

" Sets the background mode
set background=dark

" Enables the mouse with scrolling
set mouse=a

" Disables compatibility mode
set nocompatible

" Enables line numbers
set number

" Enables relative numbering
set relativenumber

" Enables spell checking
set spell

" Enables 24-bit RGB color
set termguicolors

" Sets the color scheme
colorscheme gruvbox

" Enables filetype checking
filetype on

" Enables syntax highlighting
syntax on
