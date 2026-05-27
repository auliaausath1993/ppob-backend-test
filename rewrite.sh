#!/bin/sh
git filter-branch -f --env-filter "
    export GIT_AUTHOR_NAME='Aulia Ausath'
    export GIT_AUTHOR_EMAIL='ausathaulia@gmail.com'
    export GIT_COMMITTER_NAME='Aulia Ausath'
    export GIT_COMMITTER_EMAIL='ausathaulia@gmail.com'
" --tag-name-filter cat -- --all
