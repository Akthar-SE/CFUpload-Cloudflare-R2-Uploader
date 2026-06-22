import { Hono } from 'hono'

import indexHtml from '../index.html'

const app = new Hono()

// TODO: Get File List
app.get('/files', async (c) => {
    try {
        const response = c.html(indexHtml);

        const list = await c.env.R2.list();

        const listItems = list.objects.length > 0
            ? list.objects.map(file => `
          <li>
          <span>
          <img class="file-icon file-light-icon" src="assets/icons/ui/file-light-icon.png" alt="File Light Icon">
          <img class="file-icon file-dark-icon" src="assets/icons/ui/file-dark-icon.png" alt="File Dark Icon">
          <a href="${c.env.PUBLIC_BUCKET_URL}/${file.key}">${file.key} (${formatFileSize(file.size)})</a>
          </span>
          <div class="file-list-action-container">
                <img onclick="renameFile('${file.key}')" class="file-list-action-icon" src="assets/icons/ui/file-rename-icon.png"
                                alt="File Rename Icon">
                <img onclick="deleteFile('${file.key}')" class="file-list-action-icon" src="assets/icons/ui/delete-icon.png"
                                alt="File Delete Icon">
          </div>

</li>`).join('')
            : '<li><span>No files found in bucket.</span></li>';
        return new HTMLRewriter()
            .on('#manageFilesHeading', {
                element(manageFilesHeading) { manageFilesHeading.setAttribute('style', 'display: block'); }
            })
            .on('#fileListContainer', {
                element(fileListContainer) { fileListContainer.setAttribute('style', 'display: flex'); }
            })
            .on('#fileList', {
                element(fileList) { fileList.setInnerContent(listItems, { html: true }); }
            })
            .transform(response);

    } catch (err) {
        console.error("Listing error:", err);
        return c.text(`Error listing files: ${err.message}`, 500);
    }
});

// TODO: Route For File Rename
app.post('/rename/:oldName/:newName', async (c) => {
    try {
        const oldName = c.req.param('oldName');
        const newName = c.req.param('newName');

        if (!oldName || !newName) {
            return c.json({ success: false, error: "Names are required" }, 400);
        }

        const object = await c.env.R2.get(oldName);
        if (!object) {
            return c.json({ success: false, error: "Original file not found" }, 404);
        }

        await c.env.R2.put(newName, object.body, {
            httpMetadata: object.httpMetadata,
            customMetadata: object.customMetadata,
        });

        await c.env.R2.delete(oldName);

        return c.json({ success: true, message: `Renamed ${oldName} to ${newName}` });

    } catch (error) {
        console.error(`Rename Error: ${error.message}`);
        return c.text(`Failed to rename the file: ${error.message}`, 500);
    }
});

// TODO: Route For File Deletion
app.delete('/delete/:filename', async (c) => {
    const filename = c.req.param('filename')

    try {
        if (!filename) {
            return c.json({ error: 'Filename is required' }, 400)
        }

        await c.env.R2.delete(filename)

        return c.json({ success: true, message: `File ${filename} deleted successfully` })

    } catch (error) {
        console.error(`Delete Error: ${error.message}`);
        return c.text(`Failed to delete file from storage: ${err.message}`, 500);
    }
});

app.get('*', async (c) => {
    return c.html(indexHtml)
});

// TODO: Manual Upload
app.post('/upload', async (c) => {
    try {
        const formdata = await c.req.formData();
        const file = formdata.get('file');

        if (file instanceof File) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop();
            const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
            const finalFileName = baseName + (fileExtension ? '.' + fileExtension : '');

            await c.env.R2.put(finalFileName, file.stream(), {
                httpMetadata: { contentType: file.type || 'application/octet-stream' }
            });

            const response = c.html(indexHtml);
            const fileUrl = `${c.env.PUBLIC_BUCKET_URL}/${finalFileName}`;

            return new HTMLRewriter()
                .on('#resultHeading', {
                    element(resultHeading) { resultHeading.setAttribute('style', 'display: block'); }
                })
                .on('#uploadOutputResultContainer', {
                    element(uploadOutputResultContainer) { uploadOutputResultContainer.setAttribute('style', 'display: flex'); }
                })
                .on('#resultLink', {
                    element(resultLink) {
                        resultLink.setAttribute('href', fileUrl);
                        resultLink.setInnerContent(finalFileName);
                    }
                })
                .transform(response);
        }

        return c.text("No valid file uploaded", 400);

    } catch (err) {
        console.error("Upload error:", err);
        return c.text(`Upload failed: ${err.message}`, 500);
    }
});

// TODO: URL Upload
app.post('/url', async (c) => {
    try {
        const formdata = await c.req.formData();
        const urlString = formdata.get('url');

        if (urlString) {
            const url = new URL(urlString.toString());
            const resp = await fetch(url);

            if (!resp.ok) {
                return c.text("Your URL returned a non-OK status code: " + resp.status);
            }

            const fullFileName = url.pathname.split('/').pop() || 'file';
            const extension = fullFileName.includes('.') ? fullFileName.split('.').pop() : '';
            const finalFileName = extension ?
                fullFileName.substring(0, fullFileName.lastIndexOf('.')) :
                fullFileName;

            const fileName = finalFileName + (extension ? '.' + extension : '');

            await c.env.R2.put(fileName, resp.body, {
                httpMetadata: {
                    contentType: resp.headers.get('content-type') || 'application/octet-stream'
                }
            });

            const response = c.html(indexHtml);
            const fileUrl = `${c.env.PUBLIC_BUCKET_URL}/${fileName}`;

            return new HTMLRewriter()
                .on('#resultHeading', {
                    element(resultHeading) { resultHeading.setAttribute('style', 'display: block'); }
                })
                .on('#uploadOutputResultContainer', {
                    element(uploadOutputResultContainer) { uploadOutputResultContainer.setAttribute('style', 'display: flex'); }
                })
                .on('#resultLink', {
                    element(resultLink) {
                        resultLink.setAttribute('href', fileUrl);
                        resultLink.setInnerContent(fileName);
                    }
                })
                .transform(response);
        }

        return c.text("No URL provided", 400);

    } catch (err) {
        console.error("URL error:", err);
        return c.text("Invalid URL or operation failed: " + err.message, 500);
    }
});

// TODO: API Upload
app.post('/api/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];

        if (file && file instanceof File) {
            await c.env.R2.put(file.name, file.stream(), {
                httpMetadata: { contentType: file.type || 'application/octet-stream' }
            });

            const fileUrl = `${c.env.PUBLIC_BUCKET_URL}/${file.name}`;
            //return c.text(`File successfully uploaded!` + '\n' + `Available at: ${fileUrl}\n`);
			return c.text(fileUrl);
        }

        return c.text("Error: No file found in 'file' field.\n", 400);

    } catch (err) {
        console.error("Upload error:", err);
        return c.text(`Upload failed: ${err.message}\n`, 500);
    }
});

// TODO: Format File Size Function For Worker (R2 Object List)
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('App Error', 500)
})

app.notFound((c) => {
    return c.text('Hono could not find this route', 404)
})

export default app