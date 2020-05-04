call plug#begin('~/.local/share/nvim/plugged')
	" Base 16 colorschemes
	Plug 'chriskempson/base16-vim'
call plug#end()

" Sets the color mode to 256 colors for base16 colorschemes
let base16colorspace=256

" Enables 24-bit RGB color
set termguicolors

" Sets the colorscheme
colorscheme base16-default-dark

