XYZ = node_modules/.bin/xyz --repo git@github.com:ramda/ramda-fantasy.git


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)
