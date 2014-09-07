build: watchify

clean:
	@echo cleaning
	@rm -r ./dist/*.js

watchify:
	@echo watchifying
	@watchify ./src/phpepl.js -o ./dist/phpepl.js
