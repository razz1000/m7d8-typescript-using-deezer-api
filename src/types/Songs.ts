export interface Songs {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: TitleVersion;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: Artist;
  album: Album;
  type: SongType;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: AlbumType;
}

export enum AlbumType {
  Album = "album",
}

export interface Artist {
  id: number;
  name: Name;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: ArtistType;
}

export enum Name {
  DavideGatti = "Davide Gatti",
  Luftmensch = "Luftmensch",
  Metallica = "Metallica",
  Psirico = "Psirico",
}

export enum ArtistType {
  Artist = "artist",
}

export enum TitleVersion {
  AoVivo = "(Ao Vivo)",
  Empty = "",
  Remastered = "(Remastered)",
  Remastered2021 = "(Remastered 2021)",
}

export enum SongType {
  Track = "track",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toSongs(json: string): Songs[] {
    return cast(JSON.parse(json), a(r("Songs")));
  }

  public static songsToJson(value: Songs[]): string {
    return JSON.stringify(uncast(value, a(r("Songs"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Songs: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "readable", js: "readable", typ: true },
      { json: "title", js: "title", typ: "" },
      { json: "title_short", js: "title_short", typ: "" },
      { json: "title_version", js: "title_version", typ: r("TitleVersion") },
      { json: "link", js: "link", typ: "" },
      { json: "duration", js: "duration", typ: 0 },
      { json: "rank", js: "rank", typ: 0 },
      { json: "explicit_lyrics", js: "explicit_lyrics", typ: true },
      {
        json: "explicit_content_lyrics",
        js: "explicit_content_lyrics",
        typ: 0,
      },
      { json: "explicit_content_cover", js: "explicit_content_cover", typ: 0 },
      { json: "preview", js: "preview", typ: "" },
      { json: "md5_image", js: "md5_image", typ: "" },
      { json: "artist", js: "artist", typ: r("Artist") },
      { json: "album", js: "album", typ: r("Album") },
      { json: "type", js: "type", typ: r("SongType") },
    ],
    false
  ),
  Album: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "title", js: "title", typ: "" },
      { json: "cover", js: "cover", typ: "" },
      { json: "cover_small", js: "cover_small", typ: "" },
      { json: "cover_medium", js: "cover_medium", typ: "" },
      { json: "cover_big", js: "cover_big", typ: "" },
      { json: "cover_xl", js: "cover_xl", typ: "" },
      { json: "md5_image", js: "md5_image", typ: "" },
      { json: "tracklist", js: "tracklist", typ: "" },
      { json: "type", js: "type", typ: r("AlbumType") },
    ],
    false
  ),
  Artist: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: r("Name") },
      { json: "link", js: "link", typ: "" },
      { json: "picture", js: "picture", typ: "" },
      { json: "picture_small", js: "picture_small", typ: "" },
      { json: "picture_medium", js: "picture_medium", typ: "" },
      { json: "picture_big", js: "picture_big", typ: "" },
      { json: "picture_xl", js: "picture_xl", typ: "" },
      { json: "tracklist", js: "tracklist", typ: "" },
      { json: "type", js: "type", typ: r("ArtistType") },
    ],
    false
  ),
  AlbumType: ["album"],
  Name: ["Davide Gatti", "Luftmensch", "Metallica", "Psirico"],
  ArtistType: ["artist"],
  TitleVersion: ["(Ao Vivo)", "", "(Remastered)", "(Remastered 2021)"],
  SongType: ["track"],
};
