let kbpgp = require('kbpgp');
export let pgpKey;
export let userKeys = {};

export default class PgpKey {
  constructor(key) {
    this._key = key;
    if (this.canDecrypt()) {
      this._ring = new kbpgp.keyring.KeyRing();
      this._ring.add_key_manager(key);
      pgpKey = this;
      userKeys[pgpKey.id()] = this;
    }
  }

  public() {
    return this._key.armored_pgp_public;
  }

  id() {
    return this._key.get_pgp_short_key_id();
  }

  nickname() {
    return this._key.userids[0].get_username();
  }

  encrypt(text, onDone) {
    kbpgp.box({msg: text, encrypt_for: this._key}, (_, cipher) =>
      onDone(cipher),
    );
  }

  canDecrypt() {
    return this._key.can_decrypt();
  }

  decrypt(cipher, onDone) {
    console.log("Decrypting", cipher);
    kbpgp.unbox({keyfetch: this._ring, armored: cipher, raw: cipher}, function(err, literals) {
        if(err){
          console.log(err, literals);
        } else {
          onDone(literals[0].toString());
        }
      },
    );
  }

  static generate(nickname, onDone) {
    let opt = {userid: nickname, primary: {nbits: 1024}, subkeys: []};
    kbpgp.KeyManager.generate(opt, (_, key) =>
      key.sign({}, () =>
        key.export_pgp_public({}, () => onDone(new PgpKey(key))),
      ),
    );
  }

  static load(publicKey, onDone) {
    kbpgp.KeyManager.import_from_armored_pgp({armored: publicKey}, (_, key) =>
      onDone(new PgpKey(key)),
    );
  }
}

export function get_public_key_data(user, room){
  return {publicKey: pgpKey.public(), username: user, roomId: room, sender: pgpKey.id()};
}