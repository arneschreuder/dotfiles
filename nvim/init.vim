call plug#begin('~/.local/share/nvim/plugged')
	" Gruvbox theme and goodies
	Plug 'morhetz/gruvbox'

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

" Enables line numbers
set number

" Enables relative numbering
set relativenumber

" Enables spell checking
" set spell

" Enables 24-bit RGB color
set termguicolors

" Sets the color scheme
colorscheme gruvbox

