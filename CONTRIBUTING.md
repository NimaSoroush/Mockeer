Mockeer operates under a forking model. In order to contribute, please fork the project and submit a PR. Once the merge request has been accepted you will be able to see your change available on master.
## Notes
* This library been developed and tested by latest version of node. Please check .nvmrc for node version
* Please raise an issue to discuss the change
* Please add enough unit test for coverage 
* Please update README.md & CHANGELOG.md
* Please update the version number on package.json
* References to the new dependency updated accordingly

## Integration tests
* All integration tests needs to be validated after any change

### steps
- Open terminal
- To run integration tests run
```
http-server ./src/tests/integration/mock-server
```
- Then run integration tests
```
npm run test:integration
```

## Maintainer
Project is maintained by [Nima Soroush](https://github.com/NimaSoroush).