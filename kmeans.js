function Kmeans(k, tolerance = 0.05, maxIterations = 300) {
  this.k = k
  this.tolerance = tolerance
  this.maxIterations = maxIterations
}

Kmeans.prototype.fit = function(data) {
  this.centroids = {}

  for (var i = 0; i < this.k; i++) {
    this.centroids[i] = data[i].map(n => parseInt(n))
  }

  // console.log('initial centroids', this.centroids)

  for (var iter = 0; iter < this.maxIterations; iter++) {
    this.classifications = {}

    // TODO: Refactor
    for (var j = 0; j < this.k; j++) {
      this.classifications[j] = []
    }

    for (var vector of data) {
      var [assignedCentroid, distance] = this.assign(vector)

      if (! this.classifications[assignedCentroid]) {
        this.classifications[assignedCentroid] = []
      }

      this.classifications[assignedCentroid].push(vector)

      // console.log('assign', vector, assignedCentroid, distance)
    }

    var prevCentroids = this.centroids
    var means = Object.assign({}, Object.values(this.classifications).map(this.centroidMean))
    

    // console.log('prev', prevCentroids)
    // console.log('means', means)

    this.centroids = means

    var optimal = true

    for (var c in Object.values(this.centroids)) {
      var originalCentroid = prevCentroids[c]
      var currentCentroid = this.centroids[c]

      // console.log('now checking optimum', originalCentroid, currentCentroid)

      // var distance = this.distance(this.centroids[c], means[c])
      // var distance = this.centroidDistance(this.centroids[c], means[c])
      var distance = this.centroidDistance(originalCentroid, currentCentroid)

      console.log('Distance', distance)

      if (distance > this.tolerance) {
        console.log('Not optimal', distance, this.tolerance)
        optimal = false
      }
    }

    if (optimal) {
      console.log('optimal!')
      break
    }

    // console.log('====== end of iteration ======')
    // console.log(this.centroids)
    // console.log('==============================')
  }
}

Kmeans.prototype.centroidDistance = function(c1, c2) {
  c1sum = c1.reduce((a, b) => a + b, 0)
  c2sum = c2.reduce((a, b) => a + b, 0)

  return (c2sum - c1sum) / c1sum * 100.0
}

Kmeans.prototype.centroidMean = function(centroid) {
  var results = new Array(centroid[0].length).fill(0)

  // iterate over the vector columns
  for (var i = 0; i < centroid[0].length; i++) {
    for (var vector of centroid) {
      results[i] += parseInt(vector[i])
    }
  }

  return results.map(sum => sum / centroid.length)
}

Kmeans.prototype.assign = function(vector) {
  var lowest = Infinity
  var ci = 0;

  for (var c of Object.keys(this.centroids)) {
    var distance = this.distance(vector, this.centroids[c])
    
    if (distance < lowest) {
      lowest = distance
      ci = c
    }
  }

  return [ci, lowest]
}

Kmeans.prototype.distance = function(v1, v2) {
  var total = 0

  for (c in v1) {
    if (c !== 0) {
      total += Math.pow(v2[c] - v1[c], 2)
    }
  }

  return Math.sqrt(total)
}
