#!/bin/bash

# DINOv3 Website Deployment Script
# This script helps deploy the DINOv3 website to various hosting platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
pre_deployment_checks() {
    print_status "Running pre-deployment checks..."
    
    # Check if required files exist
    local required_files=("index.html" "styles.css" "script.js" "manifest.json" "robots.txt" "sitemap.xml")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_success "All required files are present"
    
    # Check HTML validity (if html5validator is installed)
    if command_exists html5validator; then
        print_status "Validating HTML..."
        html5validator --root . --also-check-css
        print_success "HTML validation passed"
    else
        print_warning "html5validator not found. Skipping HTML validation."
    fi
    
    # Check if Node.js is available for additional tools
    if command_exists node; then
        print_status "Node.js detected. Checking for useful tools..."
        
        # Check for broken links (if broken-link-checker is installed)
        if command_exists blc; then
            print_status "Checking for broken links..."
            blc http://localhost:8000 --recursive --verbose || true
        fi
    fi
}

# Function to optimize files before deployment
optimize_files() {
    print_status "Optimizing files for production..."
    
    # Create optimized directory
    mkdir -p dist
    
    # Copy all files to dist
    cp -r * dist/ 2>/dev/null || true
    
    # Remove unnecessary files from dist
    rm -f dist/deploy.sh dist/README.md
    
    # Minify CSS if csso is available
    if command_exists csso; then
        print_status "Minifying CSS..."
        csso dist/styles.css --output dist/styles.min.css
        mv dist/styles.min.css dist/styles.css
        print_success "CSS minified"
    fi
    
    # Minify JavaScript if uglifyjs is available
    if command_exists uglifyjs; then
        print_status "Minifying JavaScript..."
        uglifyjs dist/script.js --compress --mangle --output dist/script.min.js
        mv dist/script.min.js dist/script.js
        print_success "JavaScript minified"
    fi
    
    print_success "File optimization completed"
}

# Deploy to GitHub Pages
deploy_github_pages() {
    print_status "Deploying to GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        print_error "This is not a Git repository. Initialize with 'git init' first."
        exit 1
    fi
    
    # Check if gh-pages branch exists
    if git rev-parse --verify gh-pages >/dev/null 2>&1; then
        print_status "Updating existing gh-pages branch..."
        git checkout gh-pages
        git pull origin gh-pages
    else
        print_status "Creating new gh-pages branch..."
        git checkout --orphan gh-pages
    fi
    
    # Copy dist files to root
    cp -r dist/* .
    
    # Add and commit
    git add .
    git commit -m "Deploy DINOv3 website - $(date)"
    
    # Push to GitHub
    git push origin gh-pages
    
    print_success "Deployed to GitHub Pages!"
    print_status "Your site will be available at: https://yourusername.github.io/repository-name"
}

# Deploy to Netlify (using Netlify CLI)
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_error "Netlify CLI not found. Install with: npm install -g netlify-cli"
        exit 1
    fi
    
    # Deploy to Netlify
    netlify deploy --prod --dir=dist
    
    print_success "Deployed to Netlify!"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Install with: npm install -g vercel"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    print_success "Deployed to Vercel!"
}

# Start local server for testing
start_local_server() {
    print_status "Starting local development server..."
    
    if command_exists python3; then
        print_status "Using Python 3 HTTP server on port 8000..."
        python3 -m http.server 8000
    elif command_exists python; then
        print_status "Using Python 2 HTTP server on port 8000..."
        python -m SimpleHTTPServer 8000
    elif command_exists node; then
        if command_exists npx; then
            print_status "Using Node.js serve on port 8000..."
            npx serve . -p 8000
        else
            print_error "Node.js found but npx not available. Please install serve: npm install -g serve"
            exit 1
        fi
    elif command_exists php; then
        print_status "Using PHP built-in server on port 8000..."
        php -S localhost:8000
    else
        print_error "No suitable HTTP server found. Please install Python, Node.js, or PHP."
        exit 1
    fi
}

# Run performance audit
performance_audit() {
    print_status "Running performance audit..."
    
    if command_exists lighthouse; then
        print_status "Running Lighthouse audit..."
        lighthouse http://localhost:8000 --output html --output-path ./lighthouse-report.html
        print_success "Lighthouse report generated: lighthouse-report.html"
    else
        print_warning "Lighthouse not found. Install with: npm install -g lighthouse"
    fi
}

# SSL troubleshooting
ssl_check() {
    print_status "Running SSL diagnostics..."
    
    if [ -f "ssl-check.sh" ]; then
        chmod +x ssl-check.sh
        ./ssl-check.sh dinov3.org
    else
        print_error "ssl-check.sh not found"
    fi
}

# Domain setup helper
setup_domain() {
    local domain=${1:-dinov3.org}
    
    print_status "Setting up domain: $domain"
    
    echo "📋 Domain Setup Checklist:"
    echo "1. ✅ Website files ready"
    echo "2. ⏳ Configure DNS records:"
    echo "   - A record: $domain → Your server IP"
    echo "   - CNAME: www.$domain → $domain"
    echo "3. ⏳ SSL Certificate setup:"
    echo "   - Use Cloudflare (recommended)"
    echo "   - Or Let's Encrypt"
    echo "   - Or platform-provided SSL"
    echo "4. ⏳ Test with: ./ssl-check.sh $domain"
    echo ""
    print_status "See SSL_TROUBLESHOOTING.md for detailed instructions"
}

# Main deployment function
main() {
    echo "
╔═══════════════════════════════════════╗
║         DINOv3 Website Deployer       ║
║     State-of-the-Art Computer Vision  ║
╚═══════════════════════════════════════╝
"

    case "${1:-help}" in
        "check")
            pre_deployment_checks
            ;;
        "optimize")
            optimize_files
            ;;
        "github")
            pre_deployment_checks
            optimize_files
            deploy_github_pages
            ;;
        "netlify")
            pre_deployment_checks
            optimize_files
            deploy_netlify
            ;;
        "vercel")
            pre_deployment_checks
            optimize_files
            deploy_vercel
            ;;
        "serve")
            start_local_server
            ;;
        "audit")
            performance_audit
            ;;
        "ssl-check")
            ssl_check
            ;;
        "setup-domain")
            setup_domain
            ;;
        "fix-ssl")
            print_status "SSL troubleshooting mode..."
            ssl_check
            print_status "Check SSL_TROUBLESHOOTING.md for detailed solutions"
            ;;
        "all")
            pre_deployment_checks
            optimize_files
            print_status "Files optimized and ready for deployment!"
            print_status "Choose your deployment method:"
            echo "  - GitHub Pages: ./deploy.sh github"
            echo "  - Netlify: ./deploy.sh netlify"
            echo "  - Vercel: ./deploy.sh vercel"
            ;;
        "help"|*)
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  check        Run pre-deployment checks"
            echo "  optimize     Optimize files for production"
            echo "  github       Deploy to GitHub Pages"
            echo "  netlify      Deploy to Netlify"
            echo "  vercel       Deploy to Vercel"
            echo "  serve        Start local development server"
            echo "  audit        Run performance audit"
            echo "  ssl-check    Check SSL configuration"
            echo "  setup-domain Setup domain configuration guide"
            echo "  fix-ssl      SSL troubleshooting helper"
            echo "  all          Run checks and optimize (but don't deploy)"
            echo "  help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 serve          # Start local server for testing"
            echo "  $0 check          # Validate files before deployment"
            echo "  $0 ssl-check      # Diagnose SSL issues"
            echo "  $0 fix-ssl        # SSL troubleshooting guide"
            echo "  $0 github         # Full deployment to GitHub Pages"
            echo "  $0 netlify        # Full deployment to Netlify"
            ;;
    esac
}

# Run main function with all arguments
main "$@"