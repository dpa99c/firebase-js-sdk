Project: /docs/reference/js/_project.yaml
Book: /docs/reference/_book.yaml
page_type: reference

{% comment %}
DO NOT EDIT THIS FILE!
This is generated by the JS SDK team, and any local changes will be
overwritten. Changes should be made in the source code at
https://github.com/firebase/firebase-js-sdk
{% endcomment %}

# InlineDataPart interface
Content part interface if the part represents an image.

<b>Signature:</b>

```typescript
export interface InlineDataPart 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [functionCall](./vertexai.inlinedatapart.md#inlinedatapartfunctioncall) | never |  |
|  [functionResponse](./vertexai.inlinedatapart.md#inlinedatapartfunctionresponse) | never |  |
|  [inlineData](./vertexai.inlinedatapart.md#inlinedatapartinlinedata) | [GenerativeContentBlob](./vertexai.generativecontentblob.md#generativecontentblob_interface) |  |
|  [text](./vertexai.inlinedatapart.md#inlinedataparttext) | never |  |
|  [videoMetadata](./vertexai.inlinedatapart.md#inlinedatapartvideometadata) | [VideoMetadata](./vertexai.videometadata.md#videometadata_interface) | Applicable if <code>inlineData</code> is a video. |

## InlineDataPart.functionCall

<b>Signature:</b>

```typescript
functionCall?: never;
```

## InlineDataPart.functionResponse

<b>Signature:</b>

```typescript
functionResponse?: never;
```

## InlineDataPart.inlineData

<b>Signature:</b>

```typescript
inlineData: GenerativeContentBlob;
```

## InlineDataPart.text

<b>Signature:</b>

```typescript
text?: never;
```

## InlineDataPart.videoMetadata

Applicable if `inlineData` is a video.

<b>Signature:</b>

```typescript
videoMetadata?: VideoMetadata;
```
