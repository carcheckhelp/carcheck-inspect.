# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
  ];
  # Sets environment variables in the workspace
  env = {
    FIREBASE_ADMIN_TYPE = "service_account";
    FIREBASE_ADMIN_PROJECT_ID = "carcheck-inspect";
    FIREBASE_ADMIN_PRIVATE_KEY_ID = "427a90b7c069cc1768f22c6f6e083d368c94ea6f";
    FIREBASE_ADMIN_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnORcUjL+RIrX8\nBsqzbYyIbNLtf+w2X/Qnu44jaSwzdgj1gyJJB+V+jKLIH+gvvv8JeEtXHkiSa6HF\n6tD7Qw6JNOhCY9OnJW+bOsKo+dEOSH/pqhzITPiPTw7rp5mVYNBuQZOAA5N9bMNI\nt35GPvgZdtEJd2LPcm0bk90lyPkkNnzfbtr4oZHv3TH4oiJcfQVP3k9/nTEoq3g/\n8T5qRIv3GWUZzZ5UHYVhz792KS1IwqUb8zruXDif3PTui283doreenCJB/M11t9N\nA8ORbXBonpqzgUNoBCh9JrDuAvCYypg4tflX995xrlz7qeh3V6o073oyMgodHjUp\nOfIKQHfnAgMBAAECggEAHc4WKAqCJns6VoZbYKm476P94Gj5kCOAIAjU58jaIP37\n0M6jsMKgi/LDHMpbFw+C44w2WXvDUZ2vgtg8kVw9XgU5FIQ4eEU65D8P7RBBy7ru\nWZaBdM4LS3e64BPKUw6jd9NmV93LTwKwt+hEsH6Ot/MuhPJrgTAS9GRheVed2G83\n/EqdcdLZ48W+8hmAfYIXCWpF80CyuNCS3KUuVmInj0FVWvITasrsKayTdUQezVk3\nq31SItyDlYZ2QDao9ElutOCe9tMKr3hagHa7b9cvDfb58tRzmPtDdZqGPrG7PQgX\noYa9hXlYhR94dSISv9el0B3HQW+2n/Ut07ZvmavygQKBgQDV/2dgbGMNjOfqSQuk\nPVD3+i/fhFK2SlYTtP5Ne6VYoMQNm7mFl2Pnvt3mLks+l+j33zajodj/NurwVuKC\nmepwYos/b462xh4+8eaFJn46HiyGDLGwSpgOpQQxTpyg0cCf7lVWawBy2KFxZdQV\nXeqyl9nGRL1TSXP+g2g902DTpwKBgQDIC253qs95sygQvvwl0n9XtM/JFIu5Z8ML\nlMnOKTx4c3vg5jasCX03aFNIuglH1aWPaoTuyIVGS6/FX0ANiMjPi/g5gWYXoNsZ\ny80DA1L/Y10Fd9YTB1sg3Du/vm7h2jVIfUIVpp6Hh8fqisGOEORDYdVDCK0aPqQP\nT543cdDBwQKBgQCAyVlchT5DfGZh8B3qdOBSrKW8/bSNckVFTOqylNQYd4AltG89\nP7PnV03R5lBwVhnletc2OQQP6+wOQivFb33Qru2gerHHu4meVhRmU5kpvtkKv378\nWpgSUCsqxWWrvzAOz+9Zt8GoXEkkpqSxSzkgzBRKpznNcuo05L6KXrjqBwKBgEQQ\nt66Z/OxAzEIeabcIz3FtQUH+7qfQKWpYXu350+x8Bst4KWQR+nwO0D+vpRa/GA0b\nRk3lBovrlswGY8n3H7SWwIf4gl9JySMW2BPNXsEs8uq4Yquo1hXxOZc9WYcZcwXO\nMN0jC0+8IIaqXb9T+gb/U8vyOMv0Qmg/Q+tDm69BAoGAUBVBU6SzxSxfcSj0u9SO\npVWRZVC8QQlBEIyKfL9BCW+3JEHyaFxTFs3AM13i2Ls34VOpfJQkvl4zfuNM42LM\nUXhGy4Jv+E6ry6jCOPlcE412yQ49DGMUEmrSWO1yuUDJs/3nAmugPG2ZHSE1xsnN\nJN57ezDYjbOhJVYlhiOjC34=\n-----END PRIVATE KEY-----\n";
    FIREBASE_ADMIN_CLIENT_EMAIL = "firebase-adminsdk-fbsvc@carcheck-inspect.iam.gserviceaccount.com";
    FIREBASE_ADMIN_CLIENT_ID = "116506550873418644965";
    FIREBASE_ADMIN_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
    FIREBASE_ADMIN_TOKEN_URI = "https://oauth2.googleapis.com/token";
    FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL = "https://www.googleapis.com/oauth2/v1/certs";
    FIREBASE_ADMIN_CLIENT_X509_CERT_URL = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40carcheck-inspect.iam.gserviceaccount.com";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          # Cover all the variations of language, src-dir, router (app/pages)
          "pages/index.tsx" "pages/index.js"
          "src/pages/index.tsx" "src/pages/index.js"
          "app/page.tsx" "app/page.js"
          "src/app/page.tsx" "src/app/page.js"
        ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
