# What is Logo Packer?
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Logo Packer is an open-sourced Adobe Illustrator extensions that allows you to generate your logo in multiple variations and export them for your clients in minutes.

:hourglass: Helps you to spend more time on perfecting your logo instead of creating final files for your client

:black_nib: Generates CMYK, PMS, Inverted, Grayscale, black, white and colored version of your logo with a click

:open_file_folder: Organize your files in structured and named directories.

[Click Here](https://mevcj.github.io/logo-packer/) to Github Pages

# Installation
## Install from Adobe Exchange (Recommended)
👉 <a href="https://exchange.adobe.com/creativecloud.details.106003.html"><button name="button">Download on Adobe Exchange</button></a>

## Installing manually
Download the files on [Github](https://github.com/mevCJ/logo-packer) and place the files into the CEP extension folder. 

### CEP extensions folder in Windows: 
lcoation 1
``` bash
C:\Program Files\Common Files\Adobe\CEP\extensions
```

or location 2
``` bash
C:\Program Files\Adobe\Adobe Illustrator CC 2019\Support Files\Required
```

### CEP extensions folder in MacOS: 
``` bash
/Library/Application Support/Adobe/CEP/extensions
```

<i>note: if the CEP extension folder doesn't exist, simply create one in /Library/Application Support/Adobe </i>

>Please note that the installed folder is named 'logo-packer-main' when unzipping th file

### Enabling debug mode:

**Windows:** 
1. Run regedit 
2. Navigate to HKEY_CURRENT_USER/Software/Adobe/CSXS.11, (CSXS.8 for CC 2018)
3. Add a new entry named PlayerDebugMode of type "string" with the value of "1".

**macOS:**

In the terminal, type: defaults write com.adobe.CSXS.11 PlayerDebugMode 1 (The plist is also located at /Users//Library/Preferences/com.adobe.CSXS.11.plist) (CSXS.8 for CC2018)



# How to use
Open the extension in Window > Extensions > Logo Packer and follow the instructions given.

## Creating logo variations
![logo-variation-demo](https://github.com/mevCJ/logo-packer/blob/gh-pages/assets/create-variants.gif?raw=true)

## Exporting Files
![export-files-demo](https://github.com/mevCJ/logo-packer/blob/gh-pages/assets/export-files.gif?raw=true)

<details>
  <summary>More functions</summary>
  
  ## Inverted logot ype
  ![inverted-logo-type-demo](https://raw.githubusercontent.com/wiki/schroef/logo-packer/inverted-logo-color-v132.gif?raw=true)

  ## Export sizes JPG & PNG
  ![export-sizes-demo](https://raw.githubusercontent.com/wiki/schroef/logo-packer/export-szes-jpg-png-v131.gif?raw=true)
  
  ## Custom Black for Print & Digital
  ![custom-black-demo](https://raw.githubusercontent.com/wiki/schroef/logo-packer/custom-black-color-options-v132.gif?raw=true)

  ## Custom Gray for Print & Digital
  ![custom-gray-demo](https://raw.githubusercontent.com/wiki/schroef/logo-packer/custom-gray-colors-v132.gif?raw=true)

  ## Margin & padding
  ![export-files-demo](https://github.com/mevCJ/logo-packer/blob/gh-pages/assets/margin-padding.gif?raw=true)

  ## Export format settings
  ![export-files-demo](https://github.com/mevCJ/logo-packer/blob/gh-pages/assets/export-format-settings.gif?raw=true)

  ## Save all types (beta)
  ![export-files-demo](https://github.com/mevCJ/logo-packer/blob/gh-pages/assets/save-all-types.gif?raw=true)

</details>


:tv: [Video Demo](https://youtu.be/8cH3x6DNdsM)

# Donate / Support
Your support is greatly appreciated! If you'd lke to support the developer and the project for further development, feel free to donate!

<a href="https://www.buymeacoffee.com/doingdesign"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=doingdesign&button_colour=5F7FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00"></a>

...or follow me on Instagram for more tools and logo inspiration [@doing.this](https://www.instagram.com/doing.this)

---------
<i>Licensed Under MIT</i>


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/schroef"><img src="https://avatars.githubusercontent.com/u/6923008?v=4?s=100" width="100px;" alt=""/><br /><sub><b>schroef</b></sub></a><br /><a href="https://github.com/mevCJ/logo-packer/commits?author=schroef" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
