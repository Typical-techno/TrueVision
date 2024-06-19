export const file = () => {
  const file = [];
  file.push("<br>");

  file.push(
    `<span class='command'>Are You Going to Upload a Deepfake? Sounds Intersting</span>`
  );

  file.push("<br>");

  // Add file upload input
  file.push(`
    <form id="upload-form" style="display: inline-block; margin-top: 10px;">
      <label for="file-upload" class="custom-file-upload" style="cursor: pointer; color: #00FF00;">
        <i class="fa fa-cloud-upload"></i> Upload Image
      </label>
    </form>
  `);

  return file;
};
