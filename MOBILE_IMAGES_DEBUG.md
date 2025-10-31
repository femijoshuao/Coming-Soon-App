# Mobile Images Debugging Guide

## How to Debug Mobile Images Issue

### Step 1: Open Browser Console
1. Open your app at `http://localhost:3001/`
2. Press F12 to open DevTools
3. Go to the Console tab
4. Clear any existing logs

### Step 2: Test Adding Mobile Images

1. **Login as Admin**
   - Watch console for: `usePageContent: Loaded from Firebase`
   - Note what `mobileImages` value shows

2. **Enable Mobile Images**
   - Click the "Enable Mobile Images" checkbox
   - Watch for: `updateContent called with:` log
   - Check if `mobileImages.enabled` is `true`

3. **Add an Image**
   - Click "Add Image" button
   - Watch for: `updateContent called with:` log
   - Check if images array has a new entry

4. **Enter Image URL**
   - Paste an image URL (e.g., `https://picsum.photos/400/600`)
   - Watch for: `updateContent called with:` log
   - Check if the URL is in the images array

5. **Save Settings**
   - Click "Save Settings" button
   - Watch for these logs in order:
     - `SettingsPanel: Attempting to save formData`
     - `usePageContent: Saving content to Firebase`
     - `usePageContent: Content saved successfully`
   - **Check if `mobileImages` object has the correct data**

### Step 3: Test Loading

1. **Refresh the Page**
   - Press F5 to reload
   - Watch for: `usePageContent: Loaded from Firebase`
   - **CRITICAL**: Check if `mobileImages` still has your data
   
2. **Check MobileImageDisplay**
   - Look for: `MobileImageDisplay: Received settings`
   - Check if it shows your images
   - If it says "Not rendering because:" - check the reason

### Common Issues to Look For

#### Issue 1: Data Not Saving
**Symptoms**: Console shows empty `mobileImages` after save
**Logs to check**:
```
SettingsPanel: Attempting to save formData: { mobileImages: {...} }
usePageContent: Saving content to Firebase: { mobileImages: {...} }
```
**What to verify**: Both logs should show the same mobileImages data

#### Issue 2: Data Not Loading
**Symptoms**: Data saves but disappears on reload
**Logs to check**:
```
usePageContent: Loaded from Firebase: { mobileImages: {...} }
ComingSoonPage: Firebase content loaded: { mobileImages: {...} }
```
**What to verify**: Both should show your saved images

#### Issue 3: Images Not Displaying
**Symptoms**: Data loads but images don't show
**Logs to check**:
```
MobileImageDisplay: Received settings: { enabled: true, images: [...] }
MobileImageDisplay: Not rendering because: {...}
```
**What to verify**: 
- `enabled` should be `true`
- `images` should be an array with items
- `images` should have valid URLs

### Expected Console Output (Success Case)

When everything works, you should see:

```
1. On Page Load:
   usePageContent: Loaded from Firebase: { mobileImages: { enabled: true, images: [...] } }
   ComingSoonPage: Firebase content loaded: { mobileImages: {...} }
   MobileImageDisplay: Received settings: { enabled: true, ... }
   MobileImageDisplay: Rendering with images: [...]

2. When Enabling:
   updateContent called with: { mobileImages: { enabled: true, ... } }

3. When Adding Image:
   updateContent called with: { mobileImages: { images: [{url: '', description: ''}] } }

4. When Saving:
   SettingsPanel: Attempting to save formData: { mobileImages: {...} }
   usePageContent: Saving content to Firebase: { mobileImages: {...} }
   usePageContent: Content saved successfully
```

### What to Report

If it's still not working, copy and paste:
1. All console logs from a complete test cycle
2. The specific `mobileImages` object from each log
3. Any error messages

This will help identify exactly where the data is being lost!
