#
# Sadok e-book reader
#
# Makefile used to build and install the front-end webapp
#
# Copyright 2026 Nicolas Mora <mail@babelouest.org>
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, version 3 of the License.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
# or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
# for more details.
# 
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <https://www.gnu.org/licenses/>. 
#

WEBAPP_DEST=../doc/
JSC=npm
SOURCES=src/lib/Profile.js src/lib/EpubParser.js src/lib/PDFParser.js src/lib/APIManager.js src/lib/Constants.js src/lib/SpeechSynth.js src/lib/BookParser.js src/index.js src/Sadok/ChapterList.js src/Sadok/Cover.js src/Sadok/TextBackgroundStyle.js src/Sadok/NavButtons.js src/Sadok/TopTitle.js src/Sadok/Browse.js src/Sadok/BrowseFile.js src/Sadok/SortIcon.js src/Sadok/MenuSpeedReader.js src/Sadok/SizeFormat.js src/Sadok/BookInfo.js src/Sadok/BrowseDir.js src/Sadok/ChapterItem.js src/Sadok/SubNode.js src/Sadok/Parameters.js src/Sadok/MenuSentenceReader.js src/Sadok/TimeRemaining.js src/Sadok/NodeParser.js src/Sadok/Menu.js src/Sadok/DateFormat.js src/Sadok/Chapters.js src/Sadok/ImageDisplayed.js src/Sadok/TextDisplayed.js src/Sadok/BottomInfo.js src/Sadok/MenuSpeechSynth.js src/Sadok/SessionBookmarks.js src/Sadok/App.js src/Sadok/TextBackgroundContainer.js src/Sadok/ParametersProfile.js

all: webapp

install-dev:
	$(JSC) install

dev:
	$(JSC) run dev

webapp: build-webapp install-webapp

src/lib/Build.js: $(SOURCES)
	@echo -n 'let build=' > src/lib/Build.js
	@jq -j -n --arg id $$(date +%Y%m%d%H%M) '$$ARGS.named' -c >> src/lib/Build.js
	@echo ';' >> src/lib/Build.js
	@echo 'export default build' >> src/lib/Build.js
	@echo Refresh build id

build-webapp: src/lib/Build.js
	@echo Clean old bundle
	@rm -f dist/index.js*
	@rm -f dist/*.index.js*
	@echo Build webapp
	@$(JSC) run build

install-webapp:
	@echo Install webapp files
	@find $(WEBAPP_DEST) ! -name doc ! -name .gitignore ! -name list.json ! -name config.json ! -name books ! -path "$(WEBAPP_DEST)books/*" -delete
	@cp -R dist/css/ dist/favicon.ico dist/index.js dist/*.index.js dist/img/ dist/index.html dist/js/ dist/locales/ $(WEBAPP_DEST)
