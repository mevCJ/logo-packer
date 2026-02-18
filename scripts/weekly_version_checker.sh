#!/bin/bash

# Illustrator Version Checker - Bash Script
# Scrapes Adobe Illustrator release notes and updates version files

set -euo pipefail  # Exit on error, undefined variables, and pipe failures

# Configuration
URL="https://helpx.adobe.com/illustrator/desktop/new-features/release-notes.html"
VERSION_FILE="$(dirname "$0")/../version.txt"
MANIFEST_TEMPLATE="$(dirname "$0")/../CSXS/manifest.template.xml"
MANIFEST_FILE="$(dirname "$0")/../CSXS/manifest.xml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { printf "${BLUE}%s${NC}\n" "$1"; }
print_success() { printf "${GREEN}%s${NC}\n" "$1"; }
print_warning() { printf "${YELLOW}%s${NC}\n" "$1"; }
print_error() { printf "${RED}%s${NC}\n" "$1"; }

# Function to fetch HTML content
fetch_html() {
    print_info "Fetching Adobe Illustrator release notes..."
    if ! curl -s -f "$URL"; then
        print_error "Failed to fetch HTML from $URL"
        exit 1
    fi
}

# Function to parse versions from HTML
parse_versions() {
    local html="$1"
    echo "$html" | grep -o '<h2[^>]*>.*Illustrator [0-9][0-9]*\.[0-9][0-9]*.*</h2>' | \
        sed -n 's/.*Illustrator \([0-9][0-9]*\.[0-9][0-9]*\).*/\1/p'
}

# Function to read version file
read_version_file() {
    if [[ ! -f "$VERSION_FILE" ]]; then
        print_error "Version file not found: $VERSION_FILE"
        exit 1
    fi
    
    # Read the file line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines
        [[ -z "$line" ]] && continue
        
        # Split on first = sign
        if [[ "$line" =~ ^([^=]+)=(.+)$ ]]; then
            local key="${BASH_REMATCH[1]}"
            local value="${BASH_REMATCH[2]}"
            
            # Trim whitespace
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs)
            
            case "$key" in
                version) CURRENT_EXTENSION_VERSION="$value" ;;
                hostVersion) CURRENT_HOST_VERSION="$value" ;;
            esac
        fi
    done < "$VERSION_FILE"
}

# Function to extract max version from hostVersion string
parse_host_version() {
    local host_version="$1"
    # Extract the second value from [min,max]
    echo "$host_version" | sed 's/.*,\([^]]*\)].*/\1/' | tr -d ' '
}

# Function to compare versions
# Returns: 0 if equal, 1 if v1 > v2, 2 if v1 < v2
compare_versions() {
    local v1="$1"
    local v2="$2"
    
    if [[ "$v1" == "$v2" ]]; then
        return 0
    fi
    
    local IFS=.
    local i ver1=($v1) ver2=($v2)
    
    # Fill empty positions with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    
    return 0
}

# Function to get the highest version from a list
get_highest_version() {
    local highest=""
    
    for version in "$@"; do
        if [[ -z "$highest" ]]; then
            highest="$version"
            continue
        fi
        
        set +e
        compare_versions "$version" "$highest"
        local result=$?
        set -e
        
        if [[ $result -eq 1 ]]; then
            highest="$version"
        fi
    done
    
    echo "$highest"
}

# Function to increment minor version (patch number)
increment_version() {
    local version="$1"
    local IFS=.
    local parts=($version)
    
    if [[ ${#parts[@]} -ne 3 ]]; then
        print_error "Invalid version format: $version. Expected X.Y.Z"
        exit 1
    fi
    
    local major="${parts[0]}"
    local minor="${parts[1]}"
    local patch="${parts[2]}"
    
    patch=$((patch + 1))
    
    echo "${major}.${minor}.${patch}"
}

# Function to update version.txt file
update_version_file() {
    local new_illustrator_version="$1"
    
    print_info "Updating version.txt with new Illustrator version: $new_illustrator_version"
    
    # Read current values
    read_version_file
    
    # Increment extension version
    local new_extension_version
    new_extension_version=$(increment_version "$CURRENT_EXTENSION_VERSION")
    
    # Extract min version from current hostVersion
    local min_version
    min_version=$(echo "$CURRENT_HOST_VERSION" | sed 's/\[\([^,]*\),.*/\1/' | tr -d ' ')
    
    # Create new hostVersion
    local new_host_version="[${min_version},${new_illustrator_version}]"
    
    # Write updated content
    cat > "$VERSION_FILE" << EOF
version=${new_extension_version}
hostVersion=${new_host_version}
EOF
    
    print_success "✅ Successfully updated version.txt:"
    print_success "   version: $CURRENT_EXTENSION_VERSION → $new_extension_version"
    print_success "   hostVersion: $CURRENT_HOST_VERSION → $new_host_version"
    
    # Update manifest.xml
    update_manifest_file "$new_extension_version" "$new_host_version"
    
    echo "$new_extension_version|$new_host_version"
}

# Function to update manifest.xml from template
update_manifest_file() {
    local version="$1"
    local host_version="$2"
    
    print_info "Updating manifest.xml with version: $version, hostVersion: $host_version"
    
    if [[ ! -f "$MANIFEST_TEMPLATE" ]]; then
        print_error "Manifest template not found: $MANIFEST_TEMPLATE"
        exit 1
    fi
    
    # Replace placeholders in template
    sed -e "s/{{VERSION}}/$version/g" \
        -e "s/{{HOST_VERSION}}/$host_version/g" \
        "$MANIFEST_TEMPLATE" > "$MANIFEST_FILE"
    
    print_success "✅ Successfully updated manifest.xml"
}

# Main function
main() {
    local auto_update="${1:-true}"
    
    # Fetch and parse versions
    local html
    html=$(fetch_html)
    
    print_info "Parsing HTML for version information..."
    local versions_raw
    versions_raw=$(parse_versions "$html")
    local versions=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && versions+=("$line")
    done <<< "$versions_raw"
    
    if [[ ${#versions[@]} -eq 0 ]]; then
        print_warning "No Illustrator versions found in h2 tags."
        exit 0
    fi
    
    print_success "Found ${#versions[@]} version(s):"
    for i in "${!versions[@]}"; do
        echo "$((i+1)). Illustrator ${versions[$i]}"
    done
    echo ""
    
    # Read current version
    read_version_file
    
    if [[ -z "$CURRENT_HOST_VERSION" ]]; then
        print_error "Failed to read hostVersion from version.txt"
        exit 1
    fi
    
    local current_max_version
    current_max_version=$(parse_host_version "$CURRENT_HOST_VERSION")
    
    if [[ -z "$current_max_version" ]]; then
        print_error "Failed to parse current max version from: $CURRENT_HOST_VERSION"
        exit 1
    fi
    
    print_info "Current max version in version.txt: $current_max_version"
    echo ""
    
    # Find latest online version
    local latest_online_version
    if [[ ${#versions[@]} -gt 0 ]]; then
        latest_online_version=$(get_highest_version "${versions[@]}")
    else
        print_error "No versions found"
        exit 1
    fi
    
    if [[ -z "$latest_online_version" ]]; then
        print_error "Failed to determine latest version"
        exit 1
    fi
    
    print_info "Latest version online: $latest_online_version"
    
    # Compare versions
    set +e
    compare_versions "$latest_online_version" "$current_max_version"
    local comparison=$?
    set -e
    
    echo ""
    if [[ $comparison -eq 1 ]]; then
        print_success "🎉 UPDATE AVAILABLE!"
        print_success "Current: $current_max_version → Latest: $latest_online_version"
        
        if [[ "$auto_update" == "true" ]]; then
            echo ""
            print_info "🔄 Auto-updating version files..."
            local result
            result=$(update_version_file "$latest_online_version")
            
            echo ""
            print_success "=== Summary ==="
            print_success "🎉 Files have been automatically updated!"
            
            local new_ext_version new_host_version
            IFS='|' read -r new_ext_version new_host_version <<< "$result"
            print_success "Extension version: $CURRENT_EXTENSION_VERSION → $new_ext_version"
            print_success "Illustrator version: $current_max_version → $latest_online_version"
        else
            echo "Run with auto-update enabled to update files."
        fi
    elif [[ $comparison -eq 0 ]]; then
        print_success "✅ You're up to date!"
        print_success "Current version $current_max_version matches the latest online version."
    else
        print_warning "📋 Your version is newer than online"
        print_warning "Current: $current_max_version > Latest online: $latest_online_version"
    fi
}

# Run main function
main "$@"
