export const getAttachmentAsBlob = async (attachmentUrl: string) => {
  const response = await fetch(attachmentUrl);
  return await response.blob();
};
