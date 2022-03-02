import { LivePhoto, OnfidoDownload } from "onfido-node";
import { PassThrough } from "stream";

import { createNock, onfido } from "../testHelpers";

const exampleLivePhoto: LivePhoto = {
  id: "123-abc",
  createdAt: "2020-01-01T00:00:00Z",
  href: "https://api.onfido.com/v3.3/live_photos/123-abc",
  downloadHref: "https://api.onfido.com/v3.3/live_photos/123-abc/download",
  fileName: "photo.png",
  fileType: "png",
  fileSize: 500_000
};

const exampleLivePhotoJson = {
  id: "123-abc",
  created_at: "2020-01-01T00:00:00Z",
  href: "https://api.onfido.com/v3.3/live_photos/123-abc",
  download_href: "https://api.onfido.com/v3.3/live_photos/123-abc/download",
  file_name: "photo.png",
  file_type: "png",
  file_size: 500_000
};

it("uploads a live photo", async () => {
  createNock()
    .post("/live_photos/")
    .reply(201, exampleLivePhotoJson);

  const buffer = Buffer.from("base64data", "base64");
  const bufferStream = new PassThrough();
  bufferStream.end(buffer);

  const photo = await onfido.livePhoto.upload({
    file: {
      contents: bufferStream,
      filepath: "path/name.png",
      contentType: "image/png"
    },
    applicantId: "applicant-123"
  });

  expect(photo).toEqual(exampleLivePhoto);
});

it("uploads a live photo with advanced validation", async () => {
  createNock()
    .post("/live_photos/")
    .reply(201, exampleLivePhotoJson);

  const buffer = Buffer.from("base64data", "base64");
  const bufferStream = new PassThrough();
  bufferStream.end(buffer);

  const photo = await onfido.livePhoto.upload({
    file: {
      contents: bufferStream,
      filepath: "path/name.png",
      contentType: "image/png"
    },
    applicantId: "applicant-123",
    advancedValidation: "true"
  });

  expect(photo).toEqual(exampleLivePhoto);
});

it("downloads a live photo", async () => {
  createNock()
    .get("/live_photos/abc-123/download")
    .reply(200, {});

  const file = await onfido.livePhoto.download("abc-123");

  expect(file).toBeInstanceOf(OnfidoDownload);
});

it("finds a live photo", async () => {
  createNock()
    .get("/live_photos/123-abc")
    .reply(200, exampleLivePhotoJson);

  const livePhoto = await onfido.livePhoto.find("123-abc");

  expect(livePhoto).toEqual(exampleLivePhoto);
});

it("lists live photos", async () => {
  createNock()
    .get("/live_photos/")
    .query({ applicant_id: "applicant-123" })
    .reply(200, { live_photos: [exampleLivePhotoJson, exampleLivePhotoJson] });

  const livePhotos = await onfido.livePhoto.list("applicant-123");

  expect(livePhotos).toEqual([exampleLivePhoto, exampleLivePhoto]);
});
