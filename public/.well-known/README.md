# Digital Asset Links

`assetlinks.json` tells Android that the app signed with the fingerprint below
is allowed to open this domain's URLs without showing a browser address bar.

The fingerprint is the SHA-256 of the **signing keystore** used to build the
APK. If the keystore is ever replaced, the fingerprint here must be updated in
the same change or every installed app falls back to showing a URL bar.

The keystore lives outside this repository, in `DecorBalloons-app/`, and is
deliberately not committed: anyone holding it can publish an update that
Android will accept as genuine.

Verify what is live:

    curl https://www.decorballoon.in/.well-known/assetlinks.json
