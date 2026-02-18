const { JSDOM } = require('jsdom');
const fs = require('fs').promises;
const path = require('path');

/**
 * Scrapes Adobe Illustrator release notes and finds h2 tags with version numbers
 * Uses regex to match patterns like "(Illustrator 30.1)"
 */
class IllustratorVersionChecker {
    constructor() {
        this.url = 'https://helpx.adobe.com/illustrator/desktop/new-features/release-notes.html';
        this.versionRegex = /\(Illustrator\s+(\d+\.\d+)\)/i;
        this.versionFilePath = path.join(__dirname, '..', 'version.txt');
        this.manifestTemplatePath = path.join(__dirname, '..', 'CSXS', 'manifest.template.xml');
        this.manifestPath = path.join(__dirname, '..', 'CSXS', 'manifest.xml');
    }

    /**
     * Fetches the HTML content from the Adobe release notes page
     * @returns {Promise<string>} HTML content
     */
    async fetchHTML() {
        try {
            const response = await fetch(this.url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            throw new Error(`Failed to fetch HTML: ${error.message}`);
        }
    }

    /**
     * Parses HTML and extracts h2 tags with Illustrator version numbers
     * @param {string} html - HTML content to parse
     * @returns {Array} Array of objects containing version info
     */
    parseVersions(html) {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const h2Tags = document.querySelectorAll('h2');
        const versions = [];

        h2Tags.forEach(h2 => {
            const text = h2.textContent.trim();
            const match = text.match(this.versionRegex);
            
            if (match) {
                versions.push({
                    fullText: text,
                    version: match[1],
                    element: h2.outerHTML
                });
            }
        });

        return versions;
    }

    /**
     * Main method to check for Illustrator versions
     * @returns {Promise<Array>} Array of version objects
     */
    async checkVersions() {
        try {
            console.log('Fetching Adobe Illustrator release notes...');
            const html = await this.fetchHTML();
            
            console.log('Parsing HTML for version information...');
            const versions = this.parseVersions(html);
            
            if (versions.length > 0) {
                console.log(`Found ${versions.length} version(s):`);
                versions.forEach((version, index) => {
                    console.log(`${index + 1}. ${version.fullText} (Version: ${version.version})`);
                });
            } else {
                console.log('No Illustrator versions found in h2 tags.');
            }
            
            return versions;
        } catch (error) {
            console.error('Error checking versions:', error.message);
            throw error;
        }
    }

    /**
     * Reads and parses the version.txt file
     * @returns {Promise<Object>} Parsed version data
     */
    async readVersionFile() {
        try {
            const content = await fs.readFile(this.versionFilePath, 'utf8');
            const lines = content.trim().split('\n');
            const versionData = {};
            
            lines.forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    versionData[key.trim()] = value.trim();
                }
            });
            
            return versionData;
        } catch (error) {
            throw new Error(`Failed to read version file: ${error.message}`);
        }
    }

    /**
     * Extracts the maximum host version from hostVersion string
     * @param {string} hostVersionString - String like "[17.0,30.1]"
     * @returns {string} Maximum version number
     */
    parseHostVersion(hostVersionString) {
        const match = hostVersionString.match(/\[([^,]+),([^\]]+)\]/);
        if (match) {
            return match[2].trim(); // Return the second value (max version)
        }
        throw new Error(`Invalid hostVersion format: ${hostVersionString}`);
    }

    /**
     * Compares two version strings
     * @param {string} version1 - First version (e.g., "30.1")
     * @param {string} version2 - Second version (e.g., "30.2")
     * @returns {number} -1 if version1 < version2, 0 if equal, 1 if version1 > version2
     */
    compareVersions(version1, version2) {
        const v1Parts = version1.split('.').map(Number);
        const v2Parts = version2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            
            if (v1Part < v2Part) return -1;
            if (v1Part > v2Part) return 1;
        }
        
        return 0;
    }

    /**
     * Checks if there's a newer version available compared to version.txt
     * @returns {Promise<Object>} Comparison result
     */
    async checkForUpdates() {
        try {
            console.log('Reading version.txt file...');
            const versionData = await this.readVersionFile();
            const currentMaxVersion = this.parseHostVersion(versionData.hostVersion);
            
            console.log(`Current max version in version.txt: ${currentMaxVersion}`);
            
            console.log('Checking for latest versions online...');
            const onlineVersions = await this.checkVersions();
            
            if (onlineVersions.length === 0) {
                return {
                    hasUpdate: false,
                    message: 'No versions found online',
                    currentVersion: currentMaxVersion,
                    latestVersion: null
                };
            }
            
            // Find the highest version online
            const latestOnlineVersion = onlineVersions
                .map(v => v.version)
                .sort((a, b) => this.compareVersions(b, a))[0];
            
            console.log(`Latest version online: ${latestOnlineVersion}`);
            
            const comparison = this.compareVersions(latestOnlineVersion, currentMaxVersion);
            
            const result = {
                hasUpdate: comparison > 0,
                currentVersion: currentMaxVersion,
                latestVersion: latestOnlineVersion,
                comparison: comparison,
                allOnlineVersions: onlineVersions
            };
            
            if (result.hasUpdate) {
                console.log(`\n🎉 UPDATE AVAILABLE!`);
                console.log(`Current: ${currentMaxVersion} → Latest: ${latestOnlineVersion}`);
                result.message = `New version ${latestOnlineVersion} is available (current: ${currentMaxVersion})`;
            } else if (comparison === 0) {
                console.log(`\n✅ You're up to date!`);
                console.log(`Current version ${currentMaxVersion} matches the latest online version.`);
                result.message = `You're up to date with version ${currentMaxVersion}`;
            } else {
                console.log(`\n📋 Your version is newer than online`);
                console.log(`Current: ${currentMaxVersion} > Latest online: ${latestOnlineVersion}`);
                result.message = `Your version ${currentMaxVersion} is newer than the latest online version ${latestOnlineVersion}`;
            }
            
            return result;
        } catch (error) {
            console.error('Error checking for updates:', error.message);
            throw error;
        }
    }

    /**
     * Increments the minor version number
     * @param {string} version - Version string (e.g., "1.4.4")
     * @returns {string} Incremented version (e.g., "1.4.5")
     */
    incrementMinorVersion(version) {
        const parts = version.split('.');
        if (parts.length !== 3) {
            throw new Error(`Invalid version format: ${version}. Expected format: X.Y.Z`);
        }
        
        const [major, minor, patch] = parts.map(Number);
        const newPatch = patch + 1;
        
        return `${major}.${minor}.${newPatch}`;
    }

    /**
     * Updates the manifest.xml file using the template
     * @param {string} version - Extension version (e.g., "1.4.4")
     * @param {string} hostVersion - Host version range (e.g., "[17.0,30.2]")
     * @returns {Promise<Object>}
     */
    async updateManifestFile(version, hostVersion) {
        try {
            console.log(`Updating manifest.xml with version: ${version}, hostVersion: ${hostVersion}`);
            
            // Read template
            const template = await fs.readFile(this.manifestTemplatePath, 'utf8');
            
            // Replace placeholders
            const updatedManifest = template
                .replace(/\{\{VERSION\}\}/g, version)
                .replace(/\{\{HOST_VERSION\}\}/g, hostVersion);
            
            // Write to manifest.xml
            await fs.writeFile(this.manifestPath, updatedManifest, 'utf8');
            
            console.log(`✅ Successfully updated manifest.xml`);
            
            return {
                success: true,
                version: version,
                hostVersion: hostVersion
            };
        } catch (error) {
            console.error(`Failed to update manifest file: ${error.message}`);
            throw error;
        }
    }

    /**
     * Updates the version.txt file with a new version
     * @param {string} newVersion - New Illustrator version to set
     * @returns {Promise<void>}
     */
    async updateVersionFile(newVersion) {
        try {
            console.log(`Updating version.txt with new Illustrator version: ${newVersion}`);
            
            // Read current content
            const versionData = await this.readVersionFile();
            const oldExtensionVersion = versionData.version;
            
            // Increment the extension version
            const newExtensionVersion = this.incrementMinorVersion(oldExtensionVersion);
            
            // Parse current hostVersion to get the min version
            const currentHostVersion = versionData.hostVersion;
            const match = currentHostVersion.match(/\[([^,]+),([^\]]+)\]/);
            
            if (!match) {
                throw new Error(`Invalid hostVersion format: ${currentHostVersion}`);
            }
            
            const minVersion = match[1].trim();
            
            // Create new hostVersion with updated max version
            const newHostVersion = `[${minVersion},${newVersion}]`;
            
            // Update the version data
            versionData.version = newExtensionVersion;
            versionData.hostVersion = newHostVersion;
            
            // Convert back to file format
            const newContent = Object.entries(versionData)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            
            // Write back to file
            await fs.writeFile(this.versionFilePath, newContent, 'utf8');
            
            console.log(`✅ Successfully updated version.txt:`);
            console.log(`   version: ${oldExtensionVersion} → ${newExtensionVersion}`);
            console.log(`   hostVersion: ${currentHostVersion} → ${newHostVersion}`);
            
            // Also update manifest.xml with the new extension version
            await this.updateManifestFile(newExtensionVersion, newHostVersion);
            
            return {
                success: true,
                oldExtensionVersion: oldExtensionVersion,
                newExtensionVersion: newExtensionVersion,
                oldHostVersion: match[2].trim(),
                newHostVersion: newVersion,
                oldHostVersionRange: currentHostVersion,
                newHostVersionRange: newHostVersion
            };
        } catch (error) {
            console.error(`Failed to update version file: ${error.message}`);
            throw error;
        }
    }

    /**
     * Checks for updates and automatically updates version.txt if newer version is found
     * @param {boolean} autoUpdate - Whether to automatically update the file (default: true)
     * @returns {Promise<Object>} Update result
     */
    async checkAndUpdate(autoUpdate = true) {
        try {
            const updateCheck = await this.checkForUpdates();
            
            if (updateCheck.hasUpdate && autoUpdate) {
                console.log('\n🔄 Auto-updating version.txt...');
                const updateResult = await this.updateVersionFile(updateCheck.latestVersion);
                
                return {
                    ...updateCheck,
                    updated: true,
                    updateResult: updateResult
                };
            }
            
            return {
                ...updateCheck,
                updated: false
            };
        } catch (error) {
            console.error('Error in checkAndUpdate:', error.message);
            throw error;
        }
    }

    /**
     * Finds a specific version number
     * @param {string} targetVersion - Version to search for (e.g., "30.1")
     * @returns {Promise<Object|null>} Version object if found, null otherwise
     */
    async findSpecificVersion(targetVersion) {
        try {
            const versions = await this.checkVersions();
            const found = versions.find(v => v.version === targetVersion);
            
            if (found) {
                console.log(`\nFound target version ${targetVersion}:`);
                console.log(found.fullText);
                return found;
            } else {
                console.log(`\nTarget version ${targetVersion} not found.`);
                return null;
            }
        } catch (error) {
            console.error('Error finding specific version:', error.message);
            throw error;
        }
    }
}

// Export for use as module
module.exports = IllustratorVersionChecker;

// Run if called directly
if (require.main === module) {
    const checker = new IllustratorVersionChecker();
    
    // Check for updates and automatically update version.txt if newer version is found
    checker.checkAndUpdate(true)
        .then(result => {
            console.log('\n=== Summary ===');
            console.log(result.message);
            
            if (result.updated) {
                console.log('\n🎉 Files have been automatically updated!');
                console.log(`Extension version: ${result.updateResult.oldExtensionVersion} → ${result.updateResult.newExtensionVersion}`);
                console.log(`Illustrator version: ${result.updateResult.oldHostVersion} → ${result.updateResult.newHostVersion}`);
            } else if (result.hasUpdate) {
                console.log('\nTo update manually, run with auto-update enabled.');
            }
        })
        .catch(error => {
            console.error('Script failed:', error.message);
            process.exit(1);
        });
}