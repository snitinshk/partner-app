exports.timeAgo = (reportDate) => {
    
    if(reportDate){
      const date = (new Date(reportDate).getTime())/1000
      var seconds =  Math.floor(((new Date().getTime()/1000) - date)) 
    
      var interval = seconds / 31536000;
    
      if (interval > 1) {
        var timeframe = (Math.floor(Math.abs(interval)) > 1)?' years':' year';
        return Math.floor(Math.abs(interval)) + timeframe+" ago";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        var timeframe = (Math.floor(Math.abs(interval)) > 1)?' months':' month';
        return Math.floor(Math.abs(interval)) + timeframe+" ago";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        var timeframe = (Math.floor(Math.abs(interval)) > 1)?' days':' day';
        return Math.floor(Math.abs(interval)) + timeframe+" ago";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        var timeframe = (Math.floor(Math.abs(interval)) > 1)?' hours':' hour';
        return Math.floor(Math.abs(interval)) + timeframe+" ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
        var timeframe = (Math.floor(Math.abs(interval)) > 1)?' minutes':' minute';
        return Math.floor(Math.abs(interval)) + timeframe+" ago";
      }
      return 'Just Now';
    }

}