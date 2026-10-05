#!/usr/bin/env bash
# Build the academic-styled PDF from the Markdown source with pandoc.
# Requires: pandoc (>= 2.x) and a LaTeX engine. This project uses Tectonic
# (a self-contained LaTeX engine): https://tectonic-typesetting.github.io
#
#   cargo install tectonic      # or download a release binary
#
# Then run:  ./build.sh
set -euo pipefail
cd "$(dirname "$0")"

pandoc majors-and-football.md \
  -o majors-and-football.pdf \
  --pdf-engine=tectonic \
  --citeproc --bibliography=references.bib \
  -M reference-section-title=References \
  -H header.tex \
  -V geometry:margin=0.7in \
  -V fontsize=10pt \
  -V linestretch=0.97 \
  -V colorlinks=true -V linkcolor=blue -V urlcolor=blue

echo "wrote majors-and-football.pdf"
