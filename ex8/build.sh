#!/bin/bash -x

_src=${1}

if [ ! -z "${_src}" -a -f "${_src}.small" ];
then
	find . -type f -name "${_src}.js" -delete
	find . -type f -name "${_src}*.ast" -delete
	rm -rfv small.js
	[ ! -a "small.js" ] && printf "\033[35mRemoved, 'small.js'\033[0m\n"
	npm run gen-parser
	node run.js "${_src}.small"
else
	printf "\033[35mError:\t\033[31mMissing or invalid filename was given!\n"
	printf "\033[35mTry $0 ex[0-5]\033[0m\n"
fi
