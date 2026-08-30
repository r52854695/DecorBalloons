# DecorBalloons — Android app (TWA)

> **The signing keystore is not in this repository, on purpose.**
> `android.keystore` and `keystore-password.txt` live only in the working
> folder alongside this project (`DecorBalloons-app/`). Committing them would
> let anyone who can read the repo publish an update Android treats as genuine.
> You need both files to build a release — see the warning below.

The Android app is a **Trusted Web Activity**: a thin native shell that opens
`https://www.decorballoon.in` full-screen, with no browser address bar.

It contains no copy of the site. Prices, photographs and pages all come from
the live website, so **content changes never need a new APK** — publish the
website and the app shows it. Only a change to the shell itself (name, icon,
theme colour, the URL it opens) needs rebuilding.

Current build: `decorballoons.apk` — 1.9 MB, versionCode 1, versionName 1.0.0.
It is copied into the website at `public/downloads/decorballoons.apk` and
served from https://www.decorballoon.in/app

---

## ⚠️ The keystore — read this before anything else

`android.keystore` and `keystore-password.txt` are in this folder and are
**not** in any git repository.

**If you lose them, you can never update this app again.** Android refuses to
install an update signed with a different key; every existing user would have
to uninstall and reinstall, losing the app from their home screen. There is no
recovery process and no way to ask Google to reset it — that is the whole point
of app signing.

**Back both files up now**, somewhere that is not just this laptop: a password
manager, an encrypted drive, or the client's own storage. Treat the keystore
exactly like the domain login.

The fingerprint below is published at
`https://www.decorballoon.in/.well-known/assetlinks.json`. It is what tells
Android this app is allowed to open the domain without showing a URL bar. If
the keystore is ever replaced, **that file must be updated in the same
change**, or every installed app falls back to showing a browser bar.

```
SHA-256: 40:0B:8F:95:52:84:94:F7:69:4F:F8:B8:1A:82:DC:3E:9B:C8:75:1C:9A:C6:EC:C3:C0:C3:A6:E7:CB:64:BF:82
```

---

## Rebuilding

Only needed to change the app's name, icon, colours, or the URL it opens.

```bash
export JAVA_HOME="$HOME/.bubblewrap/jdk/jdk-17.0.11+9"
export ANDROID_HOME="$HOME/.bubblewrap/android_sdk"
export PATH="$JAVA_HOME/bin:$PATH"

# 1. edit twa-manifest.json, and raise appVersionCode by 1
# 2. regenerate the android project
node build-apk.js        # stops at the gradle step; that is expected, see below

# 3. compile
./gradlew.bat assembleRelease --no-daemon

# 4. align and sign
BT="$ANDROID_HOME/build-tools/36.1.0"
PW=$(cat keystore-password.txt)
"$BT/zipalign.exe" -p 4 app/build/outputs/apk/release/app-release-unsigned.apk app-aligned.apk
"$BT/apksigner.bat" sign --ks android.keystore --ks-key-alias decorballoon \
  --ks-pass "pass:$PW" --key-pass "pass:$PW" --out decorballoons.apk app-aligned.apk
"$BT/apksigner.bat" verify --print-certs decorballoons.apk
rm app-aligned.apk

# 5. publish
cp decorballoons.apk ../DecorBallons/public/downloads/decorballoons.apk
```

`appVersionCode` **must** increase for every release. Android refuses to
install an APK whose versionCode is not higher than the installed one.

---

## Why the build is not just `bubblewrap build`

Three things broke, and they will break again on a fresh machine:

1. **The bubblewrap CLI cannot run without a TTY.** Every command prompts, and
   in a non-interactive shell it dies with `ERR_USE_AFTER_CLOSE` before doing
   anything. Piping answers in does not help — inquirer needs a real terminal.
   `build-apk.js` drives `@bubblewrap/core` directly instead, with every answer
   already in `twa-manifest.json`.

2. **Its GradleWrapper shells out to `gradlew.bat` unqualified**, which Windows
   will not resolve from the working directory. Gradle is invoked directly in
   step 3 above rather than through the library.

3. **Gradle's default heap could not be reserved.** It asks for 1536 MB;
   `gradle.properties` pins it to 768 MB. If the build dies with
   *"Could not reserve enough space for object heap"*, close whatever else is
   running and lower it further.

If you have a real terminal, `bubblewrap build` may work directly and this is
all unnecessary. It did not work here.

---

## What the app cannot do

- **iPhone.** There is no APK on iOS. iPhone users install the PWA instead:
  Share → Add to Home Screen. The `/app` page explains both.
- **Play Store.** This is a sideloaded APK, so Android shows a security warning
  before installing and the user must allow installs from that source. That
  friction is real and loses people. Publishing to Play Store would remove it,
  and the same TWA can be submitted (as an AAB — `./gradlew.bat bundleRelease`).
- **Auto-update.** Sideloaded apps do not update themselves. Website content
  still updates live; only the shell would need users to download again.
