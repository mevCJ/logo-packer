# Changelog
All notable changes to this project will be documented in this file.


## [0.6.2] - 2023-05-26
### Added
- check when loading JSON it also checks dropzone & tooltips
- tooltips settings to JSON export setting file

## [0.6.1] - 2023-05-22
### Fixed
- Auto resizer needs to check image export scale size better. When scale is to big and logo is to small, export wont work
  > it takes largest export size and uses 10% + 100 pixel. Works in most cases up to 4k
- AutoResizer sizes logo based on export size settings. Large export settings need larger base size logo, therefor autoresizer checks what setting is used.
- AutoMargin had issues when alltype logo creatin was used.
- Alltypes creation logo had issues with check and returning errors on not set values like clientname etc etc
- Issue with adding margins in pixels, got wrong conversion value

### Added
- Export sizes for PNG and JPG
- Added show / hide to DropZone when set to alltypes, doesnt work when using that
- Tooltips

## [0.6.0] - 2023-05-17
### Fixed
- Exporting JPG and PNG would add sub folder is option was on in ExportForScreens
- Hardcoded size for PNG as well, WIP need to add mulitple export sizes
- Automargin would not update when same value was added, WIP need regex oonly numberical input
- Automargin would reset to artboard 1 when using single input
- PNG export would not pickup transparency, black or white background. WIP perhaps add normal exportoptions so we have more options

## [0.5.9] - 2022-12-09
### Added
- Allow custmo alert dialog to show different icons
- Extra warnings when something goes wrong running functions. Some lacked proper feedback to user

### Fixed
- Export EPS export wrong artboard range. all artboards were exported to all logo variation folders
- Not showing error when destination folder could not be opened or was not found
- Cancel clear destination folder would still delete/clear the folder

### Others
- Reorganised custom alert dialog, moved to hostscript for easier access
- Cleanup code & leftovers

## [0.5.8] - 2022-12-08
### Fixed
- Issue when conversion to Grayscale due to new added PMS. colors were much lighter

### Added
- Document Color Profile mismatch from Color Settings warning and option to show Assign Window so profiles will match
- Custom Alert Dialog, closer to Script UI design

## [0.5.7] - 2022-12-06
### Added
- PMS conversion method and updated Panel layout

## [0.5.6] - 2022-12-01
### Added
- Export Settings Dialog implemention, settings can now be customized
- Auto margin updates works for logoinfo as well know

## [0.5.5] - 2022-11-30
### Added
- Integrated into panel layout & design of dialog

## [0.5.4] - 2022-11-29
### Added
- Add color ouputs checkboxes
- Design Export Settings Dialog

## [0.5.3] - 2022-11-24
### Added
- Color Output checkboxes, users can now define what color variations are output

## [0.5.2] - 2022-11-23
### Fixed
- Issue with generation new logos when initial created document was close. Issue with initialArtboardLength was kept in memory

## [0.5.1] - 2022-11-22
### Fixed
- Logo type info would not adjust its location when margins being adjsuted, now it gets repositioned based on the added margin (still need work when logo color types are taken out)

## [0.5.0] - 2022-11-21
### Fixed
- clear destination folder did not clean EPS files

### Added
- Better check disabling PNG export for print logo types
- Margins change automatically on changing the input value

## [0.4.9] - 2022-11-14
### Added
- EPS file export types
- Check to PNG export, disables option for print logo types

## [0.4.8] - 2022-11-11
### Fixed
- RasterEffecy Settings, now check if document is either for print or digital and adjust the DPI settings

## [0.0.1] - 2021-10-13
### Added
- Initial release

## Notes

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
<!--### Official Rigify Info-->


<!-- [0.8.1]:https://github.com/schroef/AnimDessin2/releases/tag/v0.8.1
[0.0.1]:https://github.com/schroef/AnimDessin2/releases/tag/v0.0.1 -->