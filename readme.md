# norwegian polar place names

ES2019 source for [Place names](https://stadnamn.npolar.no) (v4)
– built with web components
![Eventyrstranda](asset/eventyrstranda_svalbard.png?raw=true "Eventyrstranda")

## Development

Clone the repo, install deps, and run with

```sh
git clone https://github.com/npolar/placenames # or SSH URL
cd placenames && yarn
yarn dev
```

Starts a live-server on http://localhost:1596

## Freeze official names

Official names are frozen in code [by-area](https://github.com/npolar/placenames/blob/master/src/placename/by-area/official/official-in-area.js), to allow more efficient [name detection](https://github.com/npolar/placenames/blob/master/src/placename/detect.js)

To update, create a branch, run the commands below, and submit a pull request.
```sh
npm i -g ndjson-cli
branch="update-official-`date -uI`"
git checkout -b $branch
./bin/placenames-freeze-official
git push --set-upstream origin $branch
```
