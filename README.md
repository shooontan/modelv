# Face Tranking

## Build OpenCV.js

### Exposing

```py
# opencv/platforms/js/opencv_js.config.py

# add solvePnP, projectPoints and decomposeProjectionMatrix
calib3d = {'': ['findHomography', 'calibrateCameraExtended', 'drawFrameAxes', 'estimateAffine2D', 'getDefaultNewCameraMatrix', 'initUndistortRectifyMap', 'Rodrigues', 'solvePnP', 'projectPoints', 'decomposeProjectionMatrix']}
```

```py
# opencv/modules/js/src/embindgen.py
def add_func(self, decl):
    namespace, classes, barename = self.split_decl_name(decl[0])
    cpp_name = "::".join(namespace + classes + [barename])
    # add next 2 lines, to avoid error "Cannot register public name 'projectPoints' twice'"
    if (len(namespace) > 1) and namespace[1] == u'fisheye':
        return
    name = barename
    class_name = ''
```

### Building OpenCV.js with Docker

```bash
docker run --rm --workdir /code -v $PWD:/code "trzeci/emscripten:latest" python ./platforms/js/build_js.py build
```

After building, copy: `cp opencv/build/bin/opencv.js public/js/`
